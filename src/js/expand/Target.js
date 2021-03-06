import { slideDown, slideUp } from "../utils/animation";
import { exist } from "../utils/helpers";
import Trigger from "./Trigger";

const Target = {
  element: null,
  show() {
    this.element.style.display = "block";
    this.element.setAttribute("data-state", "opened");
  },
  hide() {
    this.element.style.display = "none";
    this.element.setAttribute("data-state", "closed");
  },
  open() {
    return new Promise((resolve) => {
      slideDown(this.element).then(() => {
        this.element.setAttribute("data-state", "opened");
        resolve();
      });
    });
  },
  close() {
    return new Promise((resolve) => {
      slideUp(this.element).then(() => {
        this.element.setAttribute("data-state", "closed");
        resolve();
      });
    });
  },
  setTargetElement(target) {
    this.element = target;
  },
  getSiblings() {
    if (!this.element) return null;
    const group = this.element.getAttribute("data-expand-group") || null;
    if (!group) return null;
    const groupElements = document.querySelectorAll(
      `[data-expand-group="${group}"]`
    );
    if (!exist(groupElements)) return null;
    const siblingsElements = Array.prototype.filter.call(
      groupElements,
      (groupElement) => groupElement !== this.element
    );
    return siblingsElements.map((siblingElement) => {
      const expandTarget = Object.create(Target);
      expandTarget.setTargetElement(siblingElement);
      return expandTarget;
    });
  },
  getTriggers() {
    if (!this.element) return null;
    const areaName = this.element.getAttribute("data-expand-id") || null;
    if (!areaName) return null;
    const triggers = document.querySelectorAll(`[data-expand="${areaName}"]`);
    if (!exist(triggers)) return null;
    return Array.from(triggers).map((trigger) => {
      const expandTrigger = Object.create(Trigger);
      expandTrigger.setTriggerElement(trigger);
      return expandTrigger;
    });
  },
  checkIsOpened() {
    if (!this.element) return true;
    const isOpenedAttr = this.element.getAttribute("data-state");
    if (!isOpenedAttr) return true;
    return isOpenedAttr === "opened";
  },
};
export default Target;
