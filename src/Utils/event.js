// eslint-disable-next-line import/no-mutable-exports
export let passiveSupported = false;

try {
  const options = Object.defineProperty({}, 'passive', {
    get() {
      passiveSupported = true;
    },
  });

  window.addEventListener('test', null, options);
} catch (err) {
  console.log('** test happenerr', err);
}

export function on(target, event, handler, passive = false) {
  target.addEventListener(event, handler, passiveSupported ? { capture: false, passive } : false);
}

export function off(target, event, handler) {
  target.removeEventListener(event, handler);
}
