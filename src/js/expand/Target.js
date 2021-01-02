import { slideDown, slideUp } from "../utils/animation";
import { exist } from "../utils/helpers";
import Trigger from "./Trigger";

const Target = {
  isOpened: true,
  element: null,
  show() {
    this.element.style.display = "block";
    this.isOpened = true;
  },
  hide() {
    this.element.style.display = "none";
    this.isOpened = false;
  },
  open() {
    return new Promise((resolve) => {
      slideDown(this.element).then(() => {
        this.isOpened = true;
        resolve();
      });
    });
  },
  close() {
    return new Promise((resolve) => {
      slideUp(this.element).then(() => {
        this.isOpened = false;
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
    return group
      ? Array.prototype.filter.call(
          groupElements,
          (groupElement) => groupElement !== this.element
        )
      : null;
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
};
export default Target;
