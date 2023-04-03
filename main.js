(() => {
  "use strict";
  const e = {
      events: {},
      data: {},
      subscribe: function (e, t) {
        (this.events[e] = this.events[e] || []), this.events[e].push(t);
      },
      unsubscribe: function (e, t) {
        if (this.events[e])
          for (let n = 0; n < this.events[e].length; n++)
            if (this.events[e][n] === t) {
              this.events[e].splice(n, 1);
              break;
            }
      },
      publish: function (e, t) {
        this.events[e] &&
          this.events[e].forEach(function (e) {
            e(t);
          });
      },
    },
    t = (function () {
      const t = function (t) {
          t.replaceChildren();
          for (let n = 0; n < 10; n++) {
            const o = document.createElement("div");
            for (let t = 0; t < 10; t++) {
              const s = document.createElement("div");
              s.classList.add(`y${n}x${t}`),
                s.addEventListener("click", (t) => {
                  t.composedPath()[2] === document.getElementById("new-board")
                    ? e.publish("placeShip", t)
                    : e.publish("cellSelection", t);
                }),
                o.append(s);
            }
            t.append(o);
          }
          return t;
        },
        n = function (e, t) {
          for (let n = 0; n < 10; n++)
            for (let o = 0; o < 10; o++)
              "object" == typeof e[n][o]
                ? (t.children[n].children[o].classList.add(
                    `ship${e[n][o].ship.body.length}`
                  ),
                  "hit" === e[n][o].section.status
                    ? (t.children[n].children[o].classList.remove("ok"),
                      t.children[n].children[o].classList.add("hit"))
                    : t.children[n].children[o].classList.add("ok"),
                  !0 === e[n][o].ship.isSunk() &&
                    t.children[n].children[o].classList.add("sunk"))
                : 0 === e[n][o] &&
                  t.children[n].children[o].classList.add("miss");
        },
        o = {
          boardOne: document.getElementById("board-one"),
          boardTwo: document.getElementById("board-two"),
          playerOneWrap: document.getElementById("player-one-wrap"),
          playerTwoWrap: document.getElementById("player-two-wrap"),
          endScreen: document.getElementById("end-screen"),
          endMessage: document.querySelector("#end-screen p"),
          endButton: document.querySelector("#end-screen button"),
          newScreen: document.getElementById("new-screen"),
          newBoard: document.getElementById("new-board"),
          newAxis: document.getElementById("axis-button"),
          newButton: document.getElementById("start-button"),
          ghIcon: document.getElementById("gh-icon"),
        };
      return (
        t(o.newBoard),
        {
          startDom: function (e) {
            e.forEach((e) => t(e));
          },
          renderShips: n,
          generateBoard: t,
          elements: o,
          switchTurn: function () {
            o.playerOneWrap.classList.toggle("turn"),
              o.playerTwoWrap.classList.toggle("turn");
          },
          hideNewScreen: function () {
            o.newScreen.classList.add("hidden");
          },
          showNewScreen: function () {
            o.newScreen.classList.remove("hidden");
          },
          hideEndScreen: function () {
            o.endScreen.classList.add("hidden");
          },
          showEndScreen: function () {
            o.endScreen.classList.remove("hidden");
          },
          updateDom: function (e) {
            n(e.one.gameboard.board, o.boardOne),
              n(e.two.gameboard.board, o.boardTwo);
          },
          getCellIndex: function (e) {
            return [+e.classList[0][1], +e.classList[0][3]];
          },
          switchAxis: function () {
            "X" === o.newAxis.textContent[o.newAxis.textContent.length - 1]
              ? (o.newAxis.textContent = "Axis: Y")
              : (o.newAxis.textContent = "Axis: X");
          },
        }
      );
    })(),
    n = function (t) {
      const n = (function () {
          const t = (function () {
              const e = [];
              for (let t = 0; t < 10; t++) e.push(Array(10));
              return e;
            })(),
            n = [];
          return {
            board: t,
            ships: n,
            placeShip: function (e, o, s = "x") {
              "x" !== s && (s = "y");
              let r = e[0],
                i = e[1];
              const c = o.body.length;
              if (r < 0 || r > 9)
                throw new Error("Cannot place ship outside board bounds!");
              if (i < 0 || i > 9)
                throw new Error("Cannot place ship outside board bounds!");
              if ("y" === s) {
                if (r > 9 - o.body.length + 1)
                  throw new Error("Ship is too big for this position!");
                let e = r;
                for (let n = 0; n < c; n++) {
                  if ("object" == typeof t[e][i])
                    throw new Error("Space already has a ship!");
                  e++;
                }
              } else {
                if (i > 9 - o.body.length + 1)
                  throw new Error("Ship is too big for this position!");
                let e = i;
                for (let n = 0; n < c; n++) {
                  if ("object" == typeof t[r][e])
                    throw new Error("Space already has a ship!");
                  e++;
                }
              }
              n.push(o);
              for (let e = 0; e < c; e++)
                (t[r][i] = { ship: o, section: o.body[e] }),
                  "x" === s ? i++ : r++;
            },
            receiveAttack: function (o) {
              const s = t[o[0]][o[1]];
              if (void 0 === s) t[o[0]][o[1]] = 0;
              else if (((s.section.status = "hit"), s.ship.isSunk()))
                return n.every((e) => e.isSunk())
                  ? e.publish("allShipsSunk", this)
                  : e.publish("shipSunk", s.ship);
            },
          };
        })(),
        o = function (t, n) {
          if (t[0] < 0 || t[0] > 9 || t[1] < 0 || t[1] > 9)
            throw new Error("Cannot attack outside the board!");
          return e.publish("attack", [n, t]);
        };
      let s,
        r = [];
      const i = function (e) {
        const t = [];
        return (
          t.push([e[0], e[1] - 1]),
          t.push([e[0], e[1] + 1]),
          t.push([e[0] - 1, e[1]]),
          t.push([e[0] + 1, e[1]]),
          t
        );
      };
      return {
        gameboard: n,
        type: t,
        attack: o,
        play: function (e, n) {
          if ("user" === t) throw new Error("Users cannot use play method!");
          let c;
          for (
            s && e[s[0]][s[1]].ship.isSunk() && ((s = void 0), (r = []));
            ;

          ) {
            if (r.length > 0) {
              if (((c = r.pop()), c[0] > 9 || c[0] < 0 || c[1] > 9 || c[1] < 0))
                continue;
            } else
              c = [
                Math.floor(10 * Math.random()),
                Math.floor(10 * Math.random()),
              ];
            const t = e[c[0]][c[1]];
            if (void 0 === t) break;
            if ("object" == typeof t && "ok" === t.section.status) {
              s || (s = c), i(c).forEach((e) => r.push(e));
              break;
            }
          }
          return o(c, n);
        },
      };
    };
  !(function () {
    const o = function () {
        return { one: n("user"), two: n("computer") };
      },
      s = function () {
        (d = d === a.one ? a.two : a.one), t.switchTurn();
      },
      r = function (e) {
        const n = e.one,
          o = e.two;
        t.startDom([c.boardOne, c.boardTwo]);
        const s = { player: n, board: c.boardOne },
          r = { player: o, board: c.boardTwo };
        return t.showNewScreen(), { one: s, two: r };
      },
      i = function (e, n, o, s, r) {
        const i = (function (e) {
          e < 1 && (e = 1), e > 5 && (e = 5);
          const t = (function (e) {
            const t = [];
            for (let n = 0; n < e; n++) t.push({ status: "ok" });
            return t;
          })(e);
          return {
            length: e,
            body: t,
            hit: function (e) {
              t[e].status = "hit";
            },
            isSunk: function () {
              return t.every((e) => "hit" === e.status);
            },
          };
        })(s);
        e.gameboard.placeShip(o, i, r), t.renderShips(e.gameboard.board, n);
      },
      c = t.elements;
    let a = o(),
      d = a.one,
      u = r(a);
    e.subscribe("attack", function (e) {
      e[0] === a.two
        ? a.two.gameboard.receiveAttack(e[1])
        : e[0] === a.one && a.one.gameboard.receiveAttack(e[1]),
        t.updateDom(a);
    }),
      e.subscribe("cellSelection", function (e) {
        const n = e.target,
          o = t.getCellIndex(n);
        u.two.board === e.composedPath()[2] &&
          (d === a.two ||
            ("miss" === n.classList[1] || "hit" === n.classList[2]
              ? console.log("Already attacked this position!")
              : (a.one.attack(o, a.two),
                s(),
                setTimeout(() => {
                  a.two.play(a.one.gameboard.board, a.one), s();
                }, 1e3))));
      }),
      e.subscribe("allShipsSunk", function (e) {
        t.showEndScreen(),
          d === a.one
            ? (c.endMessage.textContent = "You Win!")
            : (c.endMessage.textContent = "You Lose!");
      }),
      e.subscribe("placeShip", function (e) {
        if (
          a.one.gameboard.ships.length >= 4 &&
          (c.newButton.disabled && (c.newButton.disabled = !1),
          5 === a.one.gameboard.ships.length)
        )
          return;
        const n = t.getCellIndex(e.composedPath()[0]),
          o =
            c.newAxis.textContent[
              c.newAxis.textContent.length - 1
            ].toLowerCase(),
          s = a.one.gameboard.ships.length + 1;
        try {
          i(a.one, c.newBoard, n, s, o);
        } catch {}
      }),
      c.endButton.addEventListener("click", function () {
        (a = o()),
          (u = r(a)),
          (d = a.one),
          t.hideEndScreen(),
          t.showNewScreen(),
          t.generateBoard(c.newBoard);
      }),
      c.newButton.addEventListener("click", function () {
        a.one.gameboard.ships.length < 5 ||
          (t.hideNewScreen(),
          (function () {
            let e,
              t = "x",
              n = 5;
            for (; n > 0; ) {
              e = [
                Math.floor(10 * Math.random()),
                Math.floor(10 * Math.random()),
              ];
              try {
                i(a.two, c.boardTwo, e, n, t), n--, (t = "x" === t ? "y" : "x");
              } catch {
                continue;
              }
            }
          })(),
          t.renderShips(a.one.gameboard.board, c.boardOne));
      }),
      c.newAxis.addEventListener("click", t.switchAxis);
  })();
})();
