import Target from "./Target";
import Trigger from "./Trigger";

const Expand = {
  trigger: null,
  targets: null,
  busy: false,
  openCloseHandler() {
    if (this.busy) return;
    if (!this.targets) return;
    this.busy = true;
    this.targets.forEach((target) => {
      const siblings = target.getSiblings();
      if (target.isOpened) {
        this.trigger.makeInactive();
        target.close().then(() => {
          this.busy = false;
        });
      } else {
        this.trigger.makeActive();
        target.open().then(() => {
          this.busy = false;
        });
        if (siblings) {
          siblings.forEach((sibling) => {
            const siblingTarget = Object.create(Target);
            siblingTarget.setTargetElement(sibling);
            const siblingsTriggers = siblingTarget.getTriggers();
            siblingsTriggers.forEach((siblingsTrigger) => {
              siblingsTrigger.makeInactive();
            });
            siblingTarget.close();
          });
        }
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
        this.trigger.makeActive();
        target.show();
      } else if (defaultState === "closed") {
        this.trigger.makeInactive();
        target.hide();
      }
    });
  },
  setTrigger(trigger) {
    const expandTrigger = Object.create(Trigger);
    expandTrigger.setTriggerElement(trigger);
    this.trigger = expandTrigger;
  },
  setTargets(element) {
    const areaName = element.getAttribute("data-expand") || null;
    if (!areaName) return;
    const targets =
      document.querySelectorAll(`[data-expand-id="${areaName}"]`) || null;
    this.targets = Array.from(targets).map((target) => {
      const expandTarget = Object.create(Target);
      expandTarget.setTargetElement(target);
      return expandTarget;
    });
  },
  init(element) {
    if (!element) return;
    this.setTrigger(element);
    this.setTargets(element);
    this.setDefaultState();
  },
};
export const ExpandHandler = {
  listen(event) {
    const triggers = document.querySelectorAll("[data-expand]") || null;
    if (!triggers) return;
    triggers.forEach((trigger) => {
      const expand = Object.create(Expand);
      expand.init(trigger);
      trigger.addEventListener(event, (e) => {
        e.preventDefault();
        expand.openCloseHandler();
      });
    });
  },
};
