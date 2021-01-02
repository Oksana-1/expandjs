import Target from "./Target";
import { exist } from "../utils/helpers";

const Trigger = {
  element: null,
  setTriggerElement(trigger) {
    this.element = trigger;
  },
  makeActive() {
    if (!this.element) return;
    this.element.classList.add("active");
  },
  makeInactive() {
    if (!this.element) return;
    this.element.classList.remove("active");
  },
  getTargets() {
    const areaName = this.element.getAttribute("data-expand") || null;
    if (!areaName) return;
    const targets = document.querySelectorAll(`[data-expand-id="${areaName}"]`);
    if (!exist(targets)) return null;
    return Array.from(targets).map((target) => {
      const expandTarget = Object.create(Target);
      expandTarget.setTargetElement(target);
      return expandTarget;
    });
  },
};
export default Trigger;
