!(function(n) {
  var i = {};
  function r(t) {
    if (i[t]) return i[t].exports;
    var e = (i[t] = { i: t, l: !1, exports: {} });
    return n[t].call(e.exports, e, e.exports, r), (e.l = !0), e.exports;
  }
  (r.m = n),
    (r.c = i),
    (r.d = function(t, e, n) {
      r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
    }),
    (r.r = function(t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (r.t = function(e, t) {
      if ((1 & t && (e = r(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if ((r.r(n), Object.defineProperty(n, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e))
        for (var i in e)
          r.d(
            n,
            i,
            function(t) {
              return e[t];
            }.bind(null, i)
          );
      return n;
    }),
    (r.n = function(t) {
      var e =
        t && t.__esModule
          ? function() {
              return t.default;
            }
          : function() {
              return t;
            };
      return r.d(e, "a", e), e;
    }),
    (r.o = function(t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (r.p = ""),
    r((r.s = 4));
})([
  function(t, e) {
    t.exports = (function() {
      function e(t) {
        return (t * windowHeight) / 100;
      }
      function n(t) {
        return (t * windowWidth) / 100;
      }
      return {
        vh: e,
        vw: n,
        vmin: function(t) {
          return windowWidth < windowHeight ? n(t) : e(t);
        },
        id: function(t) {
          return document.getElementById(t);
        },
        q: function(t) {
          return document.querySelector(t);
        },
        qa: function(t) {
          return document.querySelectorAll(t);
        },
        isDistanceSmallerThanValue: function(t, e, n, i, r) {
          return Math.abs(t - n) >= 1.5 * r || Math.abs(e - i) >= 1.5 * r
            ? 0
            : Math.pow(t - n, 2) + Math.pow(e - i, 2) >= r * r
            ? 0
            : 1;
        },
        registerFastClick: function(e, n) {
          var i = 0;
          (e.ontouchstart = function(t) {
            t.preventDefault(), n(0, e), (i = 1);
          }),
            (e.onmousedown = function(t) {
              t.preventDefault(), n(i, e), (i = 0);
            });
        },
        postAjax: function(t, e, n, i) {
          var r = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
          (r.onreadystatechange = function() {
            3 < r.readyState && i(r.status, r.responseText ? JSON.parse(r.responseText) : null);
          }),
            r.open(e, t),
            r.send(JSON.stringify(n));
        }
      };
    })();
  },
  function(u, t, c) {
    var l;
    !(function(t) {
      "use strict";
      var r = function() {},
        e =
          t.requestAnimationFrame ||
          t.webkitRequestAnimationFrame ||
          t.mozRequestAnimationFrame ||
          t.msRequestAnimationFrame ||
          function(t) {
            return setTimeout(t, 16);
          };
      function n() {
        (this.reads = []), (this.writes = []), (this.raf = e.bind(t)), r("initialized", this);
      }
      function o(t) {
        t.scheduled ||
          ((t.scheduled = !0),
          t.raf(
            function(t) {
              r("flush");
              var e,
                n = t.writes,
                i = t.reads;
              try {
                r("flushing reads", i.length), a(i), r("flushing writes", n.length), a(n);
              } catch (t) {
                e = t;
              }
              (t.scheduled = !1), (i.length || n.length) && o(t);
              if (e) {
                if ((r("task errored", e.message), !t.catch)) throw e;
                t.catch(e);
              }
            }.bind(null, t)
          ),
          r("flush scheduled"));
      }
      function a(t) {
        var e;
        for (r("run tasks"); (e = t.shift()); ) e();
      }
      function i(t, e) {
        var n = t.indexOf(e);
        return !!~n && !!t.splice(n, 1);
      }
      n.prototype = {
        constructor: n,
        measure: function(t, e) {
          r("measure");
          var n = e ? t.bind(e) : t;
          return this.reads.push(n), o(this), n;
        },
        mutate: function(t, e) {
          r("mutate");
          var n = e ? t.bind(e) : t;
          return this.writes.push(n), o(this), n;
        },
        clear: function(t) {
          return r("clear", t), i(this.reads, t) || i(this.writes, t);
        },
        extend: function(t) {
          if ((r("extend", t), "object" != typeof t)) throw new Error("expected object");
          var e = Object.create(this);
          return (
            (function(t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            })(e, t),
            (e.fastdom = this),
            e.initialize && e.initialize(),
            e
          );
        },
        catch: null
      };
      var s = (t.fastdom = t.fastdom || new n());
      void 0 ===
        (l = function() {
          return s;
        }.call(s, c, s, u)) || (u.exports = l);
    })("undefined" != typeof window ? window : this);
  },
  function(t, e, n) {
    (function(h, p) {
      t.exports = function(t) {
        var n = t || !1;
        if (
          ((this.pause = function() {
            n = !0;
          }),
          (this.isPaused = function() {
            return n;
          }),
          windowHeight > windowWidth || (windowHeight <= windowWidth && /Mobi/.test(navigator.userAgent)))
        )
          this.play = function() {
            n = !1;
          };
        else {
          var e = h.id("particles"),
            i =
              e.getContext("webgl", {
                antialias: !0,
                powerPreference: "high-performance",
                failIfMajorPerformanceCaveat: !0
              }) || e.getContext("experimental-webgl");
          if (i) {
            (e.width = h.vw(100)), (e.height = h.vh(20));
            for (
              var r,
                o,
                a = e.width / e.height,
                s = p.createProgram(i, "v-shader", "f-shader"),
                u = {},
                c = {},
                l = {
                  type: ["triangle", "square", "circle"],
                  mode: [i.TRIANGLES, i.TRIANGLE_FAN, i.TRIANGLE_FAN],
                  sides: [3, 4, 32],
                  color: [[1, 1, 0], [0, 1, 1], [0.5, 1, 0]],
                  size: [0.175 * e.height, 0.175 * e.height, 0.13125 * e.height],
                  rawSize: [0.175, 0.175, 0.13125],
                  array: [],
                  count: 0.05 * e.width
                },
                f = 0;
              f < l.type.length;
              f++
            ) {
              (u[l.type[f]] = p.createVertexBuffer(i, l.sides[f], l.size[f] / e.width, "particles")),
                (c[l.type[f]] = p.createColorBuffer(i, l.color[f], 1, l.sides[f])),
                l.array.push([]);
              for (var d = 0; d < l.count / l.type.length; d++)
                l.array[f].push({
                  speed: ((1.5 * Math.random() + 1.5) / e.width) * 4,
                  rotation: Math.random() * Math.PI * 2,
                  x: ((Math.random() * e.width - e.width) / e.width) * 2 - 1,
                  y: 0.5 - ((Math.random() * (e.height / 2 - 2 * l.size[f]) + l.size[f]) / e.width) * 2 * a
                });
            }
            (c.black = p.createColorBuffer(i, [0.5, 0.5, 0.5], 1, 32)),
              i.viewport(0, 0, e.width, e.height),
              i.clearColor(0, 0, 0, 0),
              n || requestAnimationFrame(m),
              (this.play = function() {
                (n = !1), requestAnimationFrame(m);
              });
          } else
            this.play = function() {
              n = !1;
            };
        }
        function m() {
          for (var t = 0; t < l.type.length; t++) {
            i.bindBuffer(i.ARRAY_BUFFER, u[l.type[t]]),
              i.vertexAttribPointer(s.positionAttribute, 2, i.FLOAT, !1, 0, 0);
            for (var e = 0; e < l.array[t].length; e++)
              (o = l.array[t][e]),
                (r = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, o.x, o.y + Math.sin(o.x * Math.PI) * l.rawSize[t] * 4, 0, 1]),
                p.rotateZ(r, o.rotation, 2),
                i.uniformMatrix4fv(s.mvMatrix, !1, r),
                i.bindBuffer(i.ARRAY_BUFFER, c.black),
                i.vertexAttribPointer(s.colorAttribute, 4, i.FLOAT, !1, 0, 0),
                i.drawArrays(i.LINE_LOOP, 0, l.sides[t]),
                i.bindBuffer(i.ARRAY_BUFFER, c[l.type[t]]),
                i.vertexAttribPointer(s.colorAttribute, 4, i.FLOAT, !1, 0, 0),
                i.drawArrays(l.mode[t], 0, l.sides[t]),
                (o.rotation = 6.283 < o.rotation ? 0 : o.rotation + 0.07),
                (o.x = 1 < o.x ? -1 : o.x + o.speed);
          }
          n
            ? i.clear(i.COLOR_BUFFER_BIT)
            : requestAnimationFrame(function() {
                requestAnimationFrame(m);
              });
        }
      };
    }.call(this, n(0), n(3)));
  },
  function(t, e, n) {
    (function(u) {
      t.exports = {
        createVertexBuffer: function(t, e, n, i) {
          var r,
            o = t.createBuffer();
          if (null == i || "particles" === i) {
            r = new Float32Array(2 * e);
            for (var a = 0; a < e; a++) {
              var s = (a / e) * Math.PI * 2;
              (r[2 * a + 0] = Math.cos(s) * n),
                (r[2 * a + 1] = Math.sin(s) * n),
                "particles" === i && (r[2 * a + 1] *= u.vw(100) / u.vh(20));
            }
          }
          if ("bullet" === i)
            for ((r = new Float32Array(e + 4))[0] = -n, r[1] = -n, r[2] = n, r[3] = -n, a = 0; a < e / 2; a++)
              (s = (a / e) * Math.PI * 2), (r[2 * a + 4] = Math.cos(s) * n), (r[2 * a + 5] = Math.sin(s) * n);
          return t.bindBuffer(t.ARRAY_BUFFER, o), t.bufferData(t.ARRAY_BUFFER, r, t.STATIC_DRAW), o;
        },
        createColorBuffer: function(t, e, n, i) {
          for (var r = t.createBuffer(), o = new Float32Array(4 * i), a = 0; a < i; a++)
            (o[4 * a + 0] = e[0]), (o[4 * a + 1] = e[1]), (o[4 * a + 2] = e[2]), (o[4 * a + 3] = n);
          return t.bindBuffer(t.ARRAY_BUFFER, r), t.bufferData(t.ARRAY_BUFFER, o, t.STATIC_DRAW), r;
        },
        createProgram: function(t, e, n) {
          var i = t.createShader(t.VERTEX_SHADER),
            r = t.createShader(t.FRAGMENT_SHADER);
          t.shaderSource(i, u.id(e).innerHTML),
            t.shaderSource(r, u.id(n).innerHTML),
            t.compileShader(i),
            t.compileShader(r);
          var o = t.createProgram();
          return (
            t.attachShader(o, i),
            t.attachShader(o, r),
            t.linkProgram(o),
            t.useProgram(o),
            (o.positionAttribute = t.getAttribLocation(o, "aVertexPosition")),
            (o.colorAttribute = t.getAttribLocation(o, "aVertexColor")),
            t.enableVertexAttribArray(o.positionAttribute),
            t.enableVertexAttribArray(o.colorAttribute),
            (o.mvMatrix = t.getUniformLocation(o, "uMVMatrix")),
            "game-f-shader" === n &&
              ((o.expand = t.getUniformLocation(o, "expand")),
              (o.center = t.getUniformLocation(o, "center")),
              (o.radius = t.getUniformLocation(o, "radius")),
              (o.windowHeight = t.getUniformLocation(o, "windowHeight"))),
            o
          );
        },
        rotateZ: function(t, e, n) {
          var i = Math.cos(e),
            r = Math.sin(e);
          2 === n && (r *= u.vh(20) / u.vw(100));
          var o = t[0],
            a = t[4],
            s = t[8];
          return (
            (t[0] = i * t[0] - r * t[1]),
            (t[4] = i * t[4] - r * t[5]),
            (t[8] = i * t[8] - r * t[9]),
            (t[1] = i * t[1] + r * o),
            (t[5] = i * t[5] + r * a),
            (t[9] = i * t[9] + r * s),
            t
          );
        }
      };
    }.call(this, n(0)));
  },
  function(t, e, a) {
    (function(n, i) {
      var t = a(5);
      t.keys().forEach(t), a(22);
      var r = a(2),
        o = a(23);
      function e() {
        window.location.hash.substring(1).match(NOT_MAINMENU)
          ? ((document.body.className += " skip-start-animation"), o())
          : setTimeout(o, 1500),
          n.mutate(function() {
            document.body.className = document.body.className.replace("no-transition", "");
          }),
          (particles = new r()),
          i.registerFastClick(i.id("cat-walk"), a(24)),
          i.registerFastClick(i.id("yin-walk-body"), a(25)),
          i.registerFastClick(i.id("koishi-float"), a(26));
        for (var t = i.qa("nav>ul>li>a, .back, .internal-link"), e = 0; e < t.length; e++)
          i.registerFastClick(t[e], function(t, e) {
            window.location = e.href;
          });
        a(27)(), a(28)(), a(30)(), a(31)();
      }
      "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e) : e();
    }.call(this, a(1), a(0)));
  },
  function(t, e, n) {
    var i = {
      "./about.css": 6,
      "./animation-theme-state.css": 7,
      "./cat.css": 8,
      "./draw-transition.css": 9,
      "./font.css": 10,
      "./guestbook.css": 11,
      "./index.css": 12,
      "./koishi.css": 13,
      "./mainmenu-figure.css": 14,
      "./mainmenu-intro.css": 15,
      "./mainmenu.css": 16,
      "./media-queries.css": 17,
      "./not-mainmenu.css": 18,
      "./others.css": 19,
      "./work.css": 20,
      "./yin.css": 21
    };
    function r(t) {
      var e = o(t);
      return n(e);
    }
    function o(t) {
      var e = i[t];
      if (e + 1) return e;
      var n = new Error("Cannot find module '" + t + "'");
      throw ((n.code = "MODULE_NOT_FOUND"), n);
    }
    (r.keys = function() {
      return Object.keys(i);
    }),
      (r.resolve = o),
      ((t.exports = r).id = 5);
  },
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e, n) {},
  function(t, e) {
    t.exports = ((window.NOT_MAINMENU = /about|work|others|guestbook|spacegems/i),
    window.particles,
    window.game,
    (window.windowHeight = window.innerHeight),
    (window.windowWidth = window.innerWidth),
    void (window.gameAudio = !0));
  },
  function(t, e, n) {
    (function(u, c) {
      t.exports = function() {
        for (
          var e = !1,
            n = u.id("frame-text-overlay"),
            i = u.id("koishi-walk-container"),
            r = u.id("cat-walk-container"),
            o = u.id("yin-walk-container"),
            a = u.id("shadow"),
            t = u.qa("#mainmenu>nav>ul>li>a"),
            s = 0;
          s < t.length;
          s++
        )
          (t[s].onmouseover = function(t) {
            (e = !0),
              c.mutate(function() {
                (n.style.backgroundImage =
                  "url(\"data:image/svg+xml,%3Csvg width='" +
                  (10 * t.target.textContent.length + 20) +
                  "' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='90' height='30' fill='orange'%3E%3C/rect%3E%3Ctext x='5' y='20' fill='white' font-weight='bold' font-size='15px' font-family='Verdana, sans-serif'%3E" +
                  t.target.textContent.toUpperCase() +
                  '%3C/text%3E%3C/svg%3E")'),
                  (n.style.transform = "scale(1)"),
                  (n.style.webkitTransform = "scaleX(1)"),
                  (n.style.opacity = "1"),
                  (r.style.opacity = "0"),
                  (i.style.opacity = "0"),
                  (o.style.opacity = "0"),
                  (a.style.opacity = "0");
              });
          }),
            (t[s].onmouseout = function(t) {
              (e = !1),
                setTimeout(function() {
                  e ||
                    c.mutate(function() {
                      (n.style.transform = ""),
                        (n.style.webkitTransform = ""),
                        (n.style.opacity = ""),
                        (r.style.opacity = ""),
                        (i.style.opacity = ""),
                        (o.style.opacity = ""),
                        (a.style.opacity = "");
                    });
                }, 250);
            });
      };
    }.call(this, n(0), n(1)));
  },
  function(t, e, n) {
    (function(i, r) {
      t.exports = function(t) {
        if (1 !== t) {
          var e = i.id("mainmenu"),
            n = i.id("koishi-float-container");
          "show-ori-theme" === e.className
            ? (r.mutate(function() {
                (e.className = "show-alt-theme"), (n.style.opacity = "0");
              }),
              particles.pause())
            : (r.mutate(function() {
                (e.className = "show-ori-theme"), (n.style.opacity = "");
              }),
              particles.play());
        }
      };
    }.call(this, n(0), n(1)));
  },
  function(t, e, n) {
    (function(r, o) {
      t.exports = function(t) {
        if (1 !== t) {
          var e = r.id("bonus-bgm").textTracks[0],
            n = r.id("bonus-bgm"),
            i = r.id("subtitles");
          e.oncuechange ||
            ((e.mode = "hidden"),
            (e.oncuechange = function(t) {
              if (0 !== this.activeCues.length) {
                var e =
                  "<div class='jpn'>" +
                  this.activeCues[0].getCueAsHTML().textContent.replace("*", "</div><div class='eng'>") +
                  "</div>";
                o.mutate(function() {
                  i.innerHTML = e;
                });
              }
            })),
            n.paused
              ? ("" === i.innerHTML &&
                  4 !== n.readyState &&
                  o.mutate(function() {
                    i.innerHTML = "<div class='eng'>Loading Audio...</div>";
                  }),
                (n.volume = 0.75),
                n.play())
              : n.pause();
        }
      };
    }.call(this, n(0), n(1)));
  },
  function(t, e, n) {
    (function(i, r) {
      t.exports = function(t) {
        if (1 !== t) {
          var e = i.id("koishi-text-container"),
            n = i.q("#about>.text-container");
          r.mutate(function() {
            "" === e.style.opacity
              ? ((e.style.opacity = "1"), (e.style.pointerEvents = "auto"), (n.style.height = "100%"))
              : ((e.style.opacity = ""), (e.style.pointerEvents = ""), (n.style.height = ""));
          });
        }
      };
    }.call(this, n(0), n(1)));
  },
  function(t, e, n) {
    (function(o, a) {
      t.exports = function() {
        function i(t, i) {
          var r = o.id("message"),
            e = "https://guestbook-1.herokuapp.com/entries" + (t ? "?page=" + t : "");
          a.mutate(function() {
            r.textContent = "Populating guestbook...";
          }),
            o.postAjax(e, "GET", {}, function(t, e) {
              if (
                (a.mutate(function() {
                  o.id("older").value = "Load Older";
                }),
                e)
              )
                if (200 === t) {
                  var n = (function(t, e) {
                    for (var n, i = "", r = 0; r < t.length; r++)
                      (n = t[r]),
                        (i += "<li class='entry'><h3>"),
                        (i += (n.name || "") + " <small>("),
                        (i += (n.date || "") + ")</small></h3><p>"),
                        (i += (n.message || "") + "</p><p>"),
                        n.website &&
                          ((i += "<a href='"),
                          (i += (n.website || "") + "' target='_blank' rel='noopener'>"),
                          (i += (n.website || "") + "</a>")),
                        (i += "</p><br></li>");
                    return i;
                  })(e.results);
                  a.mutate(function() {
                    (r.textContent = e.message),
                      i ? (o.id("guestbook-entries").innerHTML = n) : (o.id("guestbook-entries").innerHTML += n),
                      e.yourEntry &&
                        ((o.q("input[name='name']").value = e.yourEntry.name || ""),
                        (o.q("input[name='message']").value = e.yourEntry.message || ""),
                        (o.q("input[name='website']").value = e.yourEntry.website || ""));
                  });
                } else
                  a.mutate(function() {
                    r.textContent = e.message;
                  });
              else
                a.mutate(function() {
                  r.textContent = "No response from server.";
                });
            });
        }
        (o.id("submit").onclick = function() {
          var n = o.id("message");
          a.mutate(function() {
            n.textContent = "Submiting entry...";
          }),
            o.postAjax(
              "https://guestbook-1.herokuapp.com/entries",
              "POST",
              {
                name: o.q("input[name='name']").value || "",
                message: o.q("input[name='message']").value || "",
                website: o.q("input[name='website']").value || ""
              },
              function(t, e) {
                e
                  ? (a.mutate(function() {
                      n.textContent = e.message;
                    }),
                    200 === t && i(0, !0))
                  : a.mutate(function() {
                      n.textContent = "No response from server.";
                    });
              }
            );
        }),
          (o.id("delete").onclick = function() {
            var n = o.id("message");
            a.mutate(function() {
              n.textContent = "Deleting entry...";
            }),
              o.postAjax("https://guestbook-1.herokuapp.com/entries", "DELETE", {}, function(t, e) {
                e
                  ? (a.mutate(function() {
                      n.textContent = e.message;
                    }),
                    200 === t && i(0, !0))
                  : a.mutate(function() {
                      n.textContent = "No response from server.";
                    });
              });
          }),
          (o.id("refresh").onclick = function() {
            i(0, !0);
          }),
          (o.id("older").onclick = function() {
            a.mutate(function() {
              o.id("older").value = "Loading...";
            }),
              i(Math.floor(o.qa(".entry").length / 10) + 1, !1);
          }),
          i(0, !0);
      };
    }.call(this, n(0), n(1)));
  },
  function(i, t, r) {
    (function(t, e) {
      var n = r(29);
      i.exports = function() {
        (e.q("#game-controls > .play").onclick = function() {
          (game = new n()),
            t.mutate(function() {
              e.id("game-controls").style.visibility = "hidden";
            });
        }),
          (e.q("#game-controls > .audio").onclick = function() {
            e.id("game-music").pause(),
              (gameAudio = !gameAudio),
              t.mutate(function() {
                e.q("#game-controls > .audio").textContent = "Audio: " + (gameAudio ? "ON" : "OFF");
              });
          });
      };
    }.call(this, r(1), r(0)));
  },
  function(t, e, n) {
    (function(P, N, O) {
      t.exports = function() {
        var e = particles.isPaused();
        particles.pause();
        var n = P.id("touhou"),
          i =
            n.getContext("webgl", { antialias: !0, powerPreference: "high-performance" }) ||
            n.getContext("experimental-webgl");
        (n.width = P.vmin(90)), (n.height = P.vmin(90));
        var r = P.id("game-score"),
          o = P.id("reisen-sprite"),
          a = P.id("koishi-sprite"),
          s = P.id("heart-container"),
          u = P.id("game-background"),
          c = P.id("heart-stream");
        if (
          (N.mutate(function() {
            (c.style.cssText = ""),
              (u.style.cssText = ""),
              (o.style.cssText = "visibility: visible"),
              (a.style.cssText = "visibility: visible"),
              (s.style.cssText = "visibility: visible"),
              (r.textContent = "0");
          }),
          gameAudio)
        ) {
          var t = P.id("bonus-bgm"),
            l = P.id("game-music");
          t.paused || t.pause(), (l.volume = 0.67), l.play(), (l.loop = !0);
        }
        var f,
          d,
          m,
          h,
          p,
          y,
          g,
          v = O.createProgram(i, "game-v-shader", "game-f-shader"),
          b = {},
          w = {},
          x = { size: (0.04 * n.height * 3) / 4, normalArray: [], bossArray: [], count: 0.05 * n.height },
          A = {
            bossCenter: [47.5, 6.25],
            bossHitbox: {},
            bossDirection: 0.5 <= Math.random() ? "left" : "right",
            playerCenter: [47.5, 85],
            playerHitbox: {},
            normalBulletSpeed: 0.0085 * n.height,
            bossBulletSpeed: 0.0043 * n.height
          };
        (A.bossHitbox = { x: P.vmin(A.bossCenter[0]), y: P.vmin(A.bossCenter[1]) }),
          (A.playerHitbox = { x: P.vmin(A.playerCenter[0]), y: P.vmin(A.playerCenter[1]) });
        for (var C = 0; C < x.count; C++)
          x.normalArray.push({
            x: Math.random() * (n.width - 2 * x.size) + x.size,
            y: Math.random() * n.height - 2 * n.height
          });
        for (var C = 0; C < 2; C++) {
          x.bossArray.push([]);
          for (var M = 0; M < x.count; M++) {
            var k = ((((x.count - M - 1) / x.count) * 360 + 270) * Math.PI) / 180;
            x.bossArray[C].push({
              x: P.vmin(0.95 * A.bossCenter[0]),
              y: P.vmin(A.bossCenter[1]),
              rMatrix: O.rotateZ([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], k, 1)
            });
          }
        }
        (b.circle = O.createVertexBuffer(i, 32, x.size / n.width, null)),
          (b.bullet = O.createVertexBuffer(i, 32, x.size / n.width, "bullet")),
          (w.red = O.createColorBuffer(i, [1, 0, 0], 1, 32)),
          (w.orange = O.createColorBuffer(i, [1, 0.5, 0], 1, 32)),
          (w.green = O.createColorBuffer(i, [0, 1, 0], 1, 32)),
          (w.yellow = O.createColorBuffer(i, [1, 1, 0], 1, 32)),
          i.uniform1f(v.expand, 0.15),
          i.uniform1f(v.radius, x.size / 2),
          i.uniform1f(v.windowHeight, n.height),
          i.viewport(0, 0, n.height, n.height),
          i.clearColor(0, 0, 0, 0);
        var T = 0,
          F = 0,
          R = !1,
          E = !1,
          L = P.vmin(1);
        function B(t) {
          E || (R = !R && ((g = [t.clientX, t.clientY]), !0));
        }
        function S(t) {
          R &&
            ((A.playerCenter[0] -= ((g[0] - t.clientX) / P.vmin(100)) * 100),
            (A.playerCenter[1] -= ((g[1] - t.clientY) / P.vmin(100)) * 100),
            (g[0] = t.clientX),
            (g[1] = t.clientY),
            N.mutate(function() {
              (a.style.transform = "translate3d(" + A.playerCenter[0] * L + "px, " + A.playerCenter[1] * L + "px, 0)"),
                (s.style.transform =
                  "translate3d(" + A.playerCenter[0] * L + "px, " + A.playerCenter[1] * L + "px, 0)"),
                (a.style.webkitTransform =
                  "translate3d(" + A.playerCenter[0] * L + "px, " + A.playerCenter[1] * L + "px, 0)"),
                (s.style.webkitTransform =
                  "translate3d(" + A.playerCenter[0] * L + "px, " + A.playerCenter[1] * L + "px, 0)");
            }));
        }
        N.mutate(function() {
          (a.style.transform = "translate3d(" + A.playerCenter[0] * L + "px," + A.playerCenter[1] * L + "px,0)"),
            (a.style.webkitTransform =
              "translate3d(" + A.playerCenter[0] * L + "px," + A.playerCenter[1] * L + "px,0)"),
            (o.style.transform = "translate3d(" + A.bossCenter[0] * L + "px," + A.bossCenter[1] * L + "px,0)"),
            (o.style.webkitTransform = "translate3d(" + A.bossCenter[0] * L + "px," + A.bossCenter[1] * L + "px,0)"),
            (s.style.transform = "translate3d(" + A.playerCenter[0] * L + "px, " + A.playerCenter[1] * L + "px, 0)"),
            (s.style.webkitTransform =
              "translate3d(" + A.playerCenter[0] * L + "px, " + A.playerCenter[1] * L + "px, 0)");
        }),
          (a.onmousedown = B),
          (a.ontouchstart = function(t) {
            B(t.touches[0]);
          }),
          (a.ontouchend = function(t) {
            B(t.touches[0]);
          }),
          (P.id("game-container").onmousemove = S),
          (P.id("game-container").ontouchmove = function(t) {
            t.preventDefault(), S(t.touches[0]);
          }),
          requestAnimationFrame(function t() {
            i.bindBuffer(i.ARRAY_BUFFER, b.circle);
            i.vertexAttribPointer(v.positionAttribute, 2, i.FLOAT, !1, 0, 0);
            240 <= T &&
              (92.44 <= A.bossCenter[0] && (A.bossDirection = "right"),
              A.bossCenter[0] <= 2.56 && (A.bossDirection = "left"),
              (A.bossCenter[0] += "left" === A.bossDirection ? 0.5 : -0.5),
              N.mutate(function() {
                (o.style.transform = "translate3d(" + A.bossCenter[0] * L + "px, " + A.bossCenter[1] * L + "px, 0)"),
                  (o.style.webkitTransform =
                    "translate3d(" + A.bossCenter[0] * L + "px, " + A.bossCenter[1] * L + "px, 0)");
              }));
            i.bindBuffer(i.ARRAY_BUFFER, w.green);
            i.vertexAttribPointer(v.colorAttribute, 4, i.FLOAT, !1, 0, 0);
            f = A.playerHitbox;
            f.x = P.vmin(0.95 * A.playerCenter[0]);
            f.y = P.vmin(0.95 * A.playerCenter[1]);
            m = (f.x / n.width) * 2 - 1;
            h = 1 - (f.y / n.height) * 2;
            i.uniformMatrix4fv(v.mvMatrix, !1, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, m, h, 0, 1]);
            i.uniform2fv(v.center, [f.x, f.y]);
            i.drawArrays(i.TRIANGLE_FAN, 0, 32);
            i.bindBuffer(i.ARRAY_BUFFER, w.red);
            i.vertexAttribPointer(v.colorAttribute, 4, i.FLOAT, !1, 0, 0);
            for (C = 0; C < x.normalArray.length; C++)
              (d = x.normalArray[C]),
                (m = (d.x / n.width) * 2 - 1),
                (h = 1 - (d.y / n.height) * 2),
                !E && P.isDistanceSmallerThanValue(f.x, f.y, d.x, d.y, x.size) && (E = !0),
                i.uniformMatrix4fv(v.mvMatrix, !1, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, m, h, 0, 1]),
                i.uniform2fv(v.center, [d.x, d.y]),
                i.drawArrays(i.TRIANGLE_FAN, 0, 32),
                d.y >= n.height + x.size
                  ? ((d.y = -x.size), (d.x = Math.random() * (n.width - 2 * x.size) + x.size))
                  : (d.y += A.normalBulletSpeed);
            i.bindBuffer(i.ARRAY_BUFFER, b.bullet);
            i.vertexAttribPointer(v.positionAttribute, 2, i.FLOAT, !1, 0, 0);
            for (C = 0; C < x.bossArray.length; C++)
              if (!(1 === C && T < 90))
                for (
                  0 === C && i.bindBuffer(i.ARRAY_BUFFER, w.yellow),
                    1 === C && i.bindBuffer(i.ARRAY_BUFFER, w.orange),
                    i.vertexAttribPointer(v.colorAttribute, 4, i.FLOAT, !1, 0, 0),
                    M = 0;
                  M < x.bossArray[C].length;
                  M++
                )
                  (d = x.bossArray[C][M]),
                    (m = (d.x / n.width) * 2 - 1),
                    (h = 1 - (d.y / n.height) * 2),
                    !E && P.isDistanceSmallerThanValue(f.x, f.y, d.x, d.y, x.size) && (E = !0),
                    ((y = d.rMatrix)[12] = m),
                    (y[13] = h),
                    i.uniformMatrix4fv(v.mvMatrix, !1, y),
                    i.uniform2fv(v.center, [d.x, d.y]),
                    i.drawArrays(i.TRIANGLE_FAN, 0, 18),
                    (p = (M / x.bossArray[C].length) * Math.PI * 2),
                    (d.x += Math.cos(p) * A.bossBulletSpeed),
                    (d.y += Math.sin(p) * A.bossBulletSpeed),
                    480 <= T && ((d.x = P.vmin(0.95 * A.bossCenter[0])), (d.y = P.vmin(A.bossCenter[1])));
            480 <= T && (T = 0);
            T++;
            Math.abs(A.playerCenter[0] - A.bossCenter[0]) <= 2.5
              ? ((F += 100) % 1e3 == 0 &&
                  N.mutate(function() {
                    r.textContent = "Score: " + (F - (F % 1e3)) / 1e3 + "k+";
                  }),
                "" === o.className &&
                  N.mutate(function() {
                    o.className = "blink";
                  }))
              : "blink" === o.className &&
                N.mutate(function() {
                  o.className = "";
                });
            E
              ? ((R = !1),
                l && l.pause(),
                (a.ontouchstart = null),
                (a.ontouchend = null),
                (P.id("game-container").onmousemove = null),
                (P.id("game-container").ontouchmove = null),
                N.mutate(function() {
                  (u.style.animationPlayState = "paused"),
                    (c.style.animationPlayState = "paused"),
                    (P.q("#game-controls > p").style.opacity = "1"),
                    (P.q("#game-controls > p").innerHTML = "FINAL SCORE<br>" + F),
                    (P.id("game-controls").style.visibility = "visible"),
                    (o.className = ""),
                    5e4 <= F &&
                      (P.q("#work .unlock").innerHTML =
                        'Link: <a href="senbonzakura/index.html" title="Thousand Cherry Blossoms" target="_blank" rel="noopener">Thousand Cherry Blossoms</a>');
                }),
                e || particles.play())
              : requestAnimationFrame(t);
          });
      };
    }.call(this, n(0), n(1), n(3)));
  },
  function(t, e, n) {
    (function(v) {
      t.exports = function() {
        var d = 0,
          m = 0,
          h = 0,
          p = { x: 0, y: 0 },
          y = !1,
          n = v.id("neko");
        function g(t, e) {
          return 0 < e && e <= t ? e / t : t < e && e < 1 ? (1 - e) / (1 - t) : (console.warn("Error computing g."), 0);
        }
        n.addEventListener(
          "touchmove",
          function(t) {
            t.preventDefault(), t.stopPropagation();
            var e = new Event("mousemove");
            (e.clientX = t.touches[0].clientX), (e.clientY = t.touches[0].clientY), n.dispatchEvent(e);
          },
          { passive: !1 }
        ),
          n.addEventListener(
            "mousemove",
            function(t) {
              if (!(y || (t.clientX === p.x && t.clientY === p.y))) {
                y = !0;
                for (
                  var e = { x: t.clientX, y: t.clientY },
                    n =
                      ((p.x === p.y ? Math.PI / 2 : Math.atan(Math.abs(p.y - e.y) / Math.abs(p.x - e.x))) /
                        (Math.PI / 2) +
                        parseInt(
                          Date.now()
                            .toString()
                            .slice(-8),
                          10
                        ) /
                          1e8) %
                      1,
                    i = (n % 1).toString(2).substring(2);
                  i.length < 52;

                )
                  i += "0";
                var r = n,
                  o = i
                    .split("")
                    .reverse()
                    .reduceRight(function(t, e) {
                      return (t + parseInt(e, 2)) / 2;
                    }, 0),
                  a = g((d + r) % 1, (m + o) % 1),
                  s = (o + a) % 1,
                  u = g(Math.min(s, m), Math.max(s, m)),
                  c = (d + a) % 1;
                if (((d = u), (m = c), (p = e), ++h % 128 == 0)) {
                  var l = v.id("draw-transition"),
                    f = Math.floor(((d + m) % 1) * 10);
                  (l.className = "active-1"),
                    (v.id("tarot").textContent = f),
                    setTimeout(function() {
                      v.id("number-history").textContent += "[" + f + "] ";
                    }, 1e3),
                    setTimeout(function() {
                      (l.className = ""), (y = !1);
                    }, 3e3);
                } else y = !1;
              }
            },
            !1
          );
      };
    }.call(this, n(0)));
  },
  function(t, e, r) {
    (function(n) {
      var i = r(2);
      t.exports = function() {
        var t = 0,
          e = null;
        window.onresize = function() {
          t++,
            null === e && (e = particles.isPaused()),
            setTimeout(function() {
              0 === --t &&
                n.mutate(function() {
                  (windowHeight = window.innerHeight),
                    (windowWidth = window.innerWidth),
                    particles.pause(),
                    (particles = new i(e)),
                    (e = null);
                });
            }, 150);
        };
      };
    }.call(this, r(1)));
  }
]);
