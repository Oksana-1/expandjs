import Trigger from "./Trigger";

const Expand = {
  trigger: null,
  targets: null,
  openCloseHandler() {
    if (!this.targets) return;
    const openCloseTargetsPromises = [];
    const closeSiblingsPromises = [];
    this.targets.forEach((target) => {
      const siblings = target.getSiblings();
      const isOpened = target.checkIsOpened();
      if (isOpened) {
        this.trigger.makeInactive();
        openCloseTargetsPromises.push(target.close());
      } else {
        this.trigger.makeActive();
        openCloseTargetsPromises.push(target.open());
        if (siblings) {
          siblings.forEach((sibling) => {
            this.busy = true;
            const siblingsTriggers = sibling.getTriggers();
            siblingsTriggers.forEach((siblingsTrigger) => {
              siblingsTrigger.makeInactive();
            });
            closeSiblingsPromises.push(sibling.close());
          });
        }
      }
    });
    return new Promise((resolve) => {
      Promise.allSettled([
        ...openCloseTargetsPromises,
        ...closeSiblingsPromises,
      ]).then(() => {
        resolve();
      });
    });
  },
  openHandler() {
    if (!this.targets) return;
    const openTargetsPromises = [];
    this.targets.forEach((target) => {
      const isOpened = target.checkIsOpened();
      if (!isOpened) {
        this.trigger.makeActive();
        openTargetsPromises.push(target.open());
      }
    });
    return new Promise((resolve) => {
      Promise.allSettled([...openTargetsPromises]).then(() => {
        resolve();
      });
    });
  },
  expandHandleFactory() {
    const isToggle = this.trigger.element.getAttribute("data-toggle");
    if (isToggle === "false") {
      return new Promise((resolve) => {
        this.openHandler().then(() => resolve());
      });
    } else {
      return new Promise((resolve) => {
        this.openCloseHandler().then(() => resolve());
      });
    }
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
  setTargets() {
    this.targets = this.trigger.getTargets();
  },
  init(element) {
    if (!element) return;
    this.setTrigger(element);
    this.setTargets();
    this.setDefaultState();
  },
};
export const ExpandHandler = {
  busy: false,
  listen(event) {
    const triggers = document.querySelectorAll("[data-expand]") || null;
    if (!triggers) return;
    triggers.forEach((trigger) => {
      const expand = Object.create(Expand);
      expand.init(trigger);
      trigger.addEventListener(event, (e) => {
        e.preventDefault();
        if (this.busy) return;
        this.busy = true;
        expand.expandHandleFactory().then(() => (this.busy = false));
      });
    });
  },
};
