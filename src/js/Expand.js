import { slideUp, slideDown } from "./animation";
const ExpandBody = {
  targets: null,
  isOpened: true,
  busy: false,
  show(block) {
    block.style.display = "block";
    this.isOpened = true;
  },
  hide(block) {
    block.style.display = "none";
    this.isOpened = false;
  },
  open(block) {
    this.busy = true;
    slideDown(block).then(() => {
      this.busy = false;
      this.isOpened = true;
    });
  },
  close(block) {
    this.busy = true;
    slideUp(block).then(() => {
      this.busy = false;
      this.isOpened = false;
    });
  },
  openCloseHandler() {
    if (this.busy) return;
    if (!this.targets) return;
    this.targets.forEach((target) => {
      this.isOpened ? this.close(target) : this.open(target);
    });
  },
  setTargets(element) {
    const areaName = element.getAttribute("data-expand") || null;
    if (!areaName) return;
    const targets =
      document.querySelectorAll(`[data-expand-id="${areaName}"]`) || null;
    if (!targets) return;
    this.targets = targets;
  },
  setDefaultState() {
    this.targets.forEach((target) => {
      const defaultState = target.getAttribute("data-default-state") || null;
      if (!defaultState) return;
      if (defaultState === "opened") {
        this.show(target);
      } else if (defaultState === "closed") {
        this.hide(target);
      }
    });
  },
  init(element) {
    if (!element) return;
    this.setTargets(element);
    this.setDefaultState();
  },
};
export const ExpandHandler = {
  getTriggers() {
    return document.querySelectorAll(".js-expand") || null;
  },
  listen(event) {
    const triggers = this.getTriggers();
    if (!triggers) return;
    triggers.forEach((trigger) => {
      const expandBody = Object.create(ExpandBody);
      expandBody.init(trigger);
      trigger.addEventListener(event, (e) => {
        e.preventDefault();
        expandBody.openCloseHandler();
      });
    });
  },
};
