import Gun from "gun/gun";

export const Database = function () {
  "use strict";

  var _gun = Gun();
  var _user = _gun.user().recall({ sessionStorage: true });

  return {
    signup(email, password) {
      _user.create(email, password, ({ err }) => {
        if (err) {
          alert(err);
          return;
        }

        this.login();
      });
    },

    login(email, password) {
      _user.auth(email, password, ({ err }) => err && alert(err));
    },

    logout() {
      _user.leave();
    },
  };
};
