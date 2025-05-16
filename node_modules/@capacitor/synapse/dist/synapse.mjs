function s(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, o) {
        return new Proxy({}, {
          get(w, r) {
            return (c, p, n) => {
              const i = t.Capacitor.Plugins[o];
              if (i === void 0) {
                n(new Error(`Capacitor plugin ${o} not found`));
                return;
              }
              if (typeof i[r] != "function") {
                n(new Error(`Method ${r} not found in Capacitor plugin ${o}`));
                return;
              }
              (async () => {
                try {
                  const a = await i[r](c);
                  p(a);
                } catch (a) {
                  n(a);
                }
              })();
            };
          }
        });
      }
    }
  );
}
function u(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, o) {
        return t.cordova.plugins[o];
      }
    }
  );
}
function y(t = !1) {
  window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !t ? s(window) : window.cordova !== void 0 && u(window);
}
export {
  y as exposeSynapse
};
