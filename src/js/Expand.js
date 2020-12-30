import { slideUp, slideDown } from "./animation";
const ExpandTarget = {
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
  setTarget(target) {
    this.element = target;
  },
};
const ExpandBody = {
  trigger: null,
  targets: null,
  busy: false,
  openCloseHandler() {
    if (this.busy) return;
    if (!this.targets) return;
    this.busy = true;
    this.targets.forEach((target) => {
      if (target.isOpened) {
        this.trigger.classList.remove("active");
        target.close().then(() => {
          this.busy = false;
        });
      } else {
        this.trigger.classList.add("active");
        target.open().then(() => {
          this.busy = false;
        });
      }
    });
  },
  setDefaultState() {
    if (!this.targets) return;
    this.targets.forEach((target) => {
      const defaultState =
        target.element.getAttribute("data-default-state") || null;
      if (!defaultState) return;
      if (defaultState === "opened") {
        this.trigger.classList.add("active");
        target.show();
      } else if (defaultState === "closed") {
        this.trigger.classList.remove("active");
        target.hide();
      }
    });
  },
  setTargets(element) {
    const areaName = element.getAttribute("data-expand") || null;
    if (!areaName) return;
    const targets =
      document.querySelectorAll(`[data-expand-id="${areaName}"]`) || null;
    this.targets = Array.from(targets).map((target) => {
      const expandTarget = Object.create(ExpandTarget);
      expandTarget.setTarget(target);
      return expandTarget;
    });
  },
  init(element) {
    if (!element) return;
    this.trigger = element;
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
