/*! modernizr 3.1.0 (Custom Build) | MIT *
* http://modernizr.com/download/?-audio-backgroundblendmode-bgsizecover-canvas-cssanimations-cssfilters-csspointerevents-csstransforms-csstransforms3d-csstransitions-cssvhunit-flexbox-geolocation-hashchange-history-objectfit-svg-svgasimg-touchevents-video-webgl-prefixed-prefixedcss-shiv !*/ !(function(
    e,
    t,
    n
) {
    function r(e, t) {
        return typeof e === t;
    }
    function o() {
        var e, t, n, o, a, i, s;
        for (var c in x) {
            if (
                ((e = []),
                (t = x[c]),
                t.name &&
                    (e.push(t.name.toLowerCase()),
                    t.options && t.options.aliases && t.options.aliases.length))
            )
                for (n = 0; n < t.options.aliases.length; n++)
                    e.push(t.options.aliases[n].toLowerCase());
            for (
                o = r(t.fn, "function") ? t.fn() : t.fn, a = 0;
                a < e.length;
                a++
            )
                (i = e[a]),
                    (s = i.split(".")),
                    1 === s.length
                        ? (Modernizr[s[0]] = o)
                        : (!Modernizr[s[0]] ||
                              Modernizr[s[0]] instanceof Boolean ||
                              (Modernizr[s[0]] = new Boolean(Modernizr[s[0]])),
                          (Modernizr[s[0]][s[1]] = o)),
                    b.push((o ? "" : "no-") + s.join("-"));
        }
    }
    function a(e) {
        return e
            .replace(/([a-z])-([a-z])/g, function(e, t, n) {
                return t + n.toUpperCase();
            })
            .replace(/^-/, "");
    }
    function i(e) {
        var t = C.className,
            n = Modernizr._config.classPrefix || "";
        if ((S && (t = t.baseVal), Modernizr._config.enableJSClass)) {
            var r = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
            t = t.replace(r, "$1" + n + "js$2");
        }
        Modernizr._config.enableClasses &&
            ((t += " " + n + e.join(" " + n)),
            S ? (C.className.baseVal = t) : (C.className = t));
    }
    function s(e) {
        return e
            .replace(/([A-Z])/g, function(e, t) {
                return "-" + t.toLowerCase();
            })
            .replace(/^ms-/, "-ms-");
    }
    function c() {
        return "function" != typeof t.createElement
            ? t.createElement(arguments[0])
            : S
                ? t.createElementNS.call(
                      t,
                      "http://www.w3.org/2000/svg",
                      arguments[0]
                  )
                : t.createElement.apply(t, arguments);
    }
    function u(e, t) {
        if ("object" == typeof e) for (var n in e) j(e, n) && u(n, e[n]);
        else {
            e = e.toLowerCase();
            var r = e.split("."),
                o = Modernizr[r[0]];
            if ((2 == r.length && (o = o[r[1]]), "undefined" != typeof o))
                return Modernizr;
            (t = "function" == typeof t ? t() : t),
                1 == r.length
                    ? (Modernizr[r[0]] = t)
                    : (!Modernizr[r[0]] ||
                          Modernizr[r[0]] instanceof Boolean ||
                          (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])),
                      (Modernizr[r[0]][r[1]] = t)),
                i([(t && 0 != t ? "" : "no-") + r.join("-")]),
                Modernizr._trigger(e, t);
        }
        return Modernizr;
    }
    function l(e, t) {
        return !!~("" + e).indexOf(t);
    }
    function d(e, t) {
        return function() {
            return e.apply(t, arguments);
        };
    }
    function f(e, t, n) {
        var o;
        for (var a in e)
            if (e[a] in t)
                return n === !1
                    ? e[a]
                    : ((o = t[e[a]]), r(o, "function") ? d(o, n || t) : o);
        return !1;
    }
    function p() {
        var e = t.body;
        return e || ((e = c(S ? "svg" : "body")), (e.fake = !0)), e;
    }
    function m(e, n, r, o) {
        var a,
            i,
            s,
            u,
            l = "modernizr",
            d = c("div"),
            f = p();
        if (parseInt(r, 10))
            for (; r--; )
                (s = c("div")),
                    (s.id = o ? o[r] : l + (r + 1)),
                    d.appendChild(s);
        return (
            (a = c("style")),
            (a.type = "text/css"),
            (a.id = "s" + l),
            (f.fake ? f : d).appendChild(a),
            f.appendChild(d),
            a.styleSheet
                ? (a.styleSheet.cssText = e)
                : a.appendChild(t.createTextNode(e)),
            (d.id = l),
            f.fake &&
                ((f.style.background = ""),
                (f.style.overflow = "hidden"),
                (u = C.style.overflow),
                (C.style.overflow = "hidden"),
                C.appendChild(f)),
            (i = n(d, e)),
            f.fake
                ? (f.parentNode.removeChild(f),
                  (C.style.overflow = u),
                  C.offsetHeight)
                : d.parentNode.removeChild(d),
            !!i
        );
    }
    function h(t, r) {
        var o = t.length;
        if ("CSS" in e && "supports" in e.CSS) {
            for (; o--; ) if (e.CSS.supports(s(t[o]), r)) return !0;
            return !1;
        }
        if ("CSSSupportsRule" in e) {
            for (var a = []; o--; ) a.push("(" + s(t[o]) + ":" + r + ")");
            return (
                (a = a.join(" or ")),
                m(
                    "@supports (" +
                        a +
                        ") { #modernizr { position: absolute; } }",
                    function(e) {
                        return "absolute" == getComputedStyle(e, null).position;
                    }
                )
            );
        }
        return n;
    }
    function v(e, t, o, i) {
        function s() {
            d && (delete F.style, delete F.modElem);
        }
        if (((i = r(i, "undefined") ? !1 : i), !r(o, "undefined"))) {
            var u = h(e, o);
            if (!r(u, "undefined")) return u;
        }
        for (var d, f, p, m, v, g = ["modernizr", "tspan"]; !F.style; )
            (d = !0), (F.modElem = c(g.shift())), (F.style = F.modElem.style);
        for (p = e.length, f = 0; p > f; f++)
            if (
                ((m = e[f]),
                (v = F.style[m]),
                l(m, "-") && (m = a(m)),
                F.style[m] !== n)
            ) {
                if (i || r(o, "undefined")) return s(), "pfx" == t ? m : !0;
                try {
                    F.style[m] = o;
                } catch (y) {}
                if (F.style[m] != v) return s(), "pfx" == t ? m : !0;
            }
        return s(), !1;
    }
    function g(e, t, n, o, a) {
        var i = e.charAt(0).toUpperCase() + e.slice(1),
            s = (e + " " + z.join(i + " ") + i).split(" ");
        return r(t, "string") || r(t, "undefined")
            ? v(s, t, o, a)
            : ((s = (e + " " + $.join(i + " ") + i).split(" ")), f(s, t, n));
    }
    function y(e, t, r) {
        return g(e, n, n, t, r);
    }
    var b = [],
        x = [],
        T = {
            _version: "3.1.0",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function(e, t) {
                var n = this;
                setTimeout(function() {
                    t(n[e]);
                }, 0);
            },
            addTest: function(e, t, n) {
                x.push({ name: e, fn: t, options: n });
            },
            addAsyncTest: function(e) {
                x.push({ name: null, fn: e });
            }
        },
        Modernizr = function() {};
    (Modernizr.prototype = T),
        (Modernizr = new Modernizr()),
        Modernizr.addTest("geolocation", "geolocation" in navigator),
        Modernizr.addTest("history", function() {
            var t = navigator.userAgent;
            return (-1 === t.indexOf("Android 2.") &&
                -1 === t.indexOf("Android 4.0")) ||
                -1 === t.indexOf("Mobile Safari") ||
                -1 !== t.indexOf("Chrome") ||
                -1 !== t.indexOf("Windows Phone")
                ? e.history && "pushState" in e.history
                : !1;
        }),
        Modernizr.addTest(
            "svg",
            !!t.createElementNS &&
                !!t.createElementNS("http://www.w3.org/2000/svg", "svg")
                    .createSVGRect
        );
    var C = t.documentElement,
        S = "svg" === C.nodeName.toLowerCase();
    S ||
        !(function(e, t) {
            function n(e, t) {
                var n = e.createElement("p"),
                    r = e.getElementsByTagName("head")[0] || e.documentElement;
                return (
                    (n.innerHTML = "x<style>" + t + "</style>"),
                    r.insertBefore(n.lastChild, r.firstChild)
                );
            }
            function r() {
                var e = b.elements;
                return "string" == typeof e ? e.split(" ") : e;
            }
            function o(e, t) {
                var n = b.elements;
                "string" != typeof n && (n = n.join(" ")),
                    "string" != typeof e && (e = e.join(" ")),
                    (b.elements = n + " " + e),
                    u(t);
            }
            function a(e) {
                var t = y[e[v]];
                return t || ((t = {}), g++, (e[v] = g), (y[g] = t)), t;
            }
            function i(e, n, r) {
                if ((n || (n = t), d)) return n.createElement(e);
                r || (r = a(n));
                var o;
                return (
                    (o = r.cache[e]
                        ? r.cache[e].cloneNode()
                        : h.test(e)
                            ? (r.cache[e] = r.createElem(e)).cloneNode()
                            : r.createElem(e)),
                    !o.canHaveChildren || m.test(e) || o.tagUrn
                        ? o
                        : r.frag.appendChild(o)
                );
            }
            function s(e, n) {
                if ((e || (e = t), d)) return e.createDocumentFragment();
                n = n || a(e);
                for (
                    var o = n.frag.cloneNode(), i = 0, s = r(), c = s.length;
                    c > i;
                    i++
                )
                    o.createElement(s[i]);
                return o;
            }
            function c(e, t) {
                t.cache ||
                    ((t.cache = {}),
                    (t.createElem = e.createElement),
                    (t.createFrag = e.createDocumentFragment),
                    (t.frag = t.createFrag())),
                    (e.createElement = function(n) {
                        return b.shivMethods ? i(n, e, t) : t.createElem(n);
                    }),
                    (e.createDocumentFragment = Function(
                        "h,f",
                        "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" +
                            r()
                                .join()
                                .replace(/[\w\-:]+/g, function(e) {
                                    return (
                                        t.createElem(e),
                                        t.frag.createElement(e),
                                        'c("' + e + '")'
                                    );
                                }) +
                            ");return n}"
                    )(b, t.frag));
            }
            function u(e) {
                e || (e = t);
                var r = a(e);
                return (
                    !b.shivCSS ||
                        l ||
                        r.hasCSS ||
                        (r.hasCSS = !!n(
                            e,
                            "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}"
                        )),
                    d || c(e, r),
                    e
                );
            }
            var l,
                d,
                f = "3.7.3",
                p = e.html5 || {},
                m = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
                h = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
                v = "_html5shiv",
                g = 0,
                y = {};
            !(function() {
                try {
                    var e = t.createElement("a");
                    (e.innerHTML = "<xyz></xyz>"),
                        (l = "hidden" in e),
                        (d =
                            1 == e.childNodes.length ||
                            (function() {
                                t.createElement("a");
                                var e = t.createDocumentFragment();
                                return (
                                    "undefined" == typeof e.cloneNode ||
                                    "undefined" ==
                                        typeof e.createDocumentFragment ||
                                    "undefined" == typeof e.createElement
                                );
                            })());
                } catch (n) {
                    (l = !0), (d = !0);
                }
            })();
            var b = {
                elements:
                    p.elements ||
                    "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
                version: f,
                shivCSS: p.shivCSS !== !1,
                supportsUnknownElements: d,
                shivMethods: p.shivMethods !== !1,
                type: "default",
                shivDocument: u,
                createElement: i,
                createDocumentFragment: s,
                addElements: o
            };
            (e.html5 = b),
                u(t),
                "object" == typeof module &&
                    module.exports &&
                    (module.exports = b);
        })("undefined" != typeof e ? e : this, t),
        Modernizr.addTest("audio", function() {
            var e = c("audio"),
                t = !1;
            try {
                (t = !!e.canPlayType) &&
                    ((t = new Boolean(t)),
                    (t.ogg = e
                        .canPlayType('audio/ogg; codecs="vorbis"')
                        .replace(/^no$/, "")),
                    (t.mp3 = e.canPlayType("audio/mpeg;").replace(/^no$/, "")),
                    (t.opus = e
                        .canPlayType('audio/ogg; codecs="opus"')
                        .replace(/^no$/, "")),
                    (t.wav = e
                        .canPlayType('audio/wav; codecs="1"')
                        .replace(/^no$/, "")),
                    (t.m4a = (
                        e.canPlayType("audio/x-m4a;") ||
                        e.canPlayType("audio/aac;")
                    ).replace(/^no$/, "")));
            } catch (n) {}
            return t;
        }),
        Modernizr.addTest("canvas", function() {
            var e = c("canvas");
            return !(!e.getContext || !e.getContext("2d"));
        }),
        Modernizr.addTest("webgl", function() {
            var t = c("canvas"),
                n =
                    "probablySupportsContext" in t
                        ? "probablySupportsContext"
                        : "supportsContext";
            return n in t
                ? t[n]("webgl") || t[n]("experimental-webgl")
                : "WebGLRenderingContext" in e;
        }),
        Modernizr.addTest("video", function() {
            var e = c("video"),
                t = !1;
            try {
                (t = !!e.canPlayType) &&
                    ((t = new Boolean(t)),
                    (t.ogg = e
                        .canPlayType('video/ogg; codecs="theora"')
                        .replace(/^no$/, "")),
                    (t.h264 = e
                        .canPlayType('video/mp4; codecs="avc1.42E01E"')
                        .replace(/^no$/, "")),
                    (t.webm = e
                        .canPlayType('video/webm; codecs="vp8, vorbis"')
                        .replace(/^no$/, "")),
                    (t.vp9 = e
                        .canPlayType('video/webm; codecs="vp9"')
                        .replace(/^no$/, "")),
                    (t.hls = e
                        .canPlayType(
                            'application/x-mpegURL; codecs="avc1.42E01E"'
                        )
                        .replace(/^no$/, "")));
            } catch (n) {}
            return t;
        }),
        Modernizr.addTest("csspointerevents", function() {
            var e = c("a").style;
            return (
                (e.cssText = "pointer-events:auto"), "auto" === e.pointerEvents
            );
        });
    var w = (function(e) {
        function n(t, n) {
            var o;
            return t
                ? ((n && "string" != typeof n) || (n = c(n || "div")),
                  (t = "on" + t),
                  (o = t in n),
                  !o &&
                      r &&
                      (n.setAttribute || (n = c("div")),
                      n.setAttribute(t, ""),
                      (o = "function" == typeof n[t]),
                      n[t] !== e && (n[t] = e),
                      n.removeAttribute(t)),
                  o)
                : !1;
        }
        var r = !("onblur" in t.documentElement);
        return n;
    })();
    (T.hasEvent = w),
        Modernizr.addTest("hashchange", function() {
            return w("hashchange", e) === !1
                ? !1
                : t.documentMode === n || t.documentMode > 7;
        });
    var E = T._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
    T._prefixes = E;
    var _ = "CSS" in e && "supports" in e.CSS,
        P = "supportsCSS" in e;
    Modernizr.addTest("supports", _ || P);
    var j;
    !(function() {
        var e = {}.hasOwnProperty;
        j =
            r(e, "undefined") || r(e.call, "undefined")
                ? function(e, t) {
                      return (
                          t in e && r(e.constructor.prototype[t], "undefined")
                      );
                  }
                : function(t, n) {
                      return e.call(t, n);
                  };
    })(),
        (T._l = {}),
        (T.on = function(e, t) {
            this._l[e] || (this._l[e] = []),
                this._l[e].push(t),
                Modernizr.hasOwnProperty(e) &&
                    setTimeout(function() {
                        Modernizr._trigger(e, Modernizr[e]);
                    }, 0);
        }),
        (T._trigger = function(e, t) {
            if (this._l[e]) {
                var n = this._l[e];
                setTimeout(function() {
                    var e, r;
                    for (e = 0; e < n.length; e++) (r = n[e])(t);
                }, 0),
                    delete this._l[e];
            }
        }),
        Modernizr._q.push(function() {
            T.addTest = u;
        }),
        Modernizr.addTest(
            "svgasimg",
            t.implementation.hasFeature(
                "http://www.w3.org/TR/SVG11/feature#Image",
                "1.1"
            )
        );
    var N = "Moz O ms Webkit",
        z = T._config.usePrefixes ? N.split(" ") : [];
    T._cssomPrefixes = z;
    var k = function(t) {
        var r,
            o = E.length,
            a = e.CSSRule;
        if ("undefined" == typeof a) return n;
        if (!t) return !1;
        if (
            ((t = t.replace(/^@/, "")),
            (r = t.replace(/-/g, "_").toUpperCase() + "_RULE"),
            r in a)
        )
            return "@" + t;
        for (var i = 0; o > i; i++) {
            var s = E[i],
                c = s.toUpperCase() + "_" + r;
            if (c in a) return "@-" + s.toLowerCase() + "-" + t;
        }
        return !1;
    };
    T.atRule = k;
    var $ = T._config.usePrefixes ? N.toLowerCase().split(" ") : [];
    T._domPrefixes = $;
    var A = (T.testStyles = m);
    Modernizr.addTest("touchevents", function() {
        var n;
        if (
            "ontouchstart" in e ||
            (e.DocumentTouch && t instanceof DocumentTouch)
        )
            n = !0;
        else {
            var r = [
                "@media (",
                E.join("touch-enabled),("),
                "heartz",
                ")",
                "{#modernizr{top:9px;position:absolute}}"
            ].join("");
            A(r, function(e) {
                n = 9 === e.offsetTop;
            });
        }
        return n;
    }),
        A("#modernizr { height: 50vh; }", function(t) {
            var n = parseInt(e.innerHeight / 2, 10),
                r = parseInt(
                    (e.getComputedStyle
                        ? getComputedStyle(t, null)
                        : t.currentStyle
                    ).height,
                    10
                );
            Modernizr.addTest("cssvhunit", r == n);
        });
    var M = { elem: c("modernizr") };
    Modernizr._q.push(function() {
        delete M.elem;
    });
    var F = { style: M.elem.style };
    Modernizr._q.unshift(function() {
        delete F.style;
    }),
        (T.testAllProps = g);
    var L = (T.prefixed = function(e, t, n) {
        return 0 === e.indexOf("@")
            ? k(e)
            : (-1 != e.indexOf("-") && (e = a(e)),
              t ? g(e, t, n) : g(e, "pfx"));
    });
    T.prefixedCSS = function(e) {
        var t = L(e);
        return t && s(t);
    };
    Modernizr.addTest("backgroundblendmode", L("backgroundBlendMode", "text")),
        Modernizr.addTest("objectfit", !!L("objectFit"), {
            aliases: ["object-fit"]
        }),
        (T.testAllProps = y),
        Modernizr.addTest("cssanimations", y("animationName", "a", !0)),
        Modernizr.addTest("bgsizecover", y("backgroundSize", "cover")),
        Modernizr.addTest("flexbox", y("flexBasis", "1px", !0)),
        Modernizr.addTest("cssfilters", function() {
            if (Modernizr.supports) return y("filter", "blur(2px)");
            var e = c("a");
            return (
                (e.style.cssText = E.join("filter:blur(2px); ")),
                !!e.style.length && (t.documentMode === n || t.documentMode > 9)
            );
        }),
        Modernizr.addTest("csstransforms", function() {
            return (
                -1 === navigator.userAgent.indexOf("Android 2.") &&
                y("transform", "scale(1)", !0)
            );
        }),
        Modernizr.addTest("csstransforms3d", function() {
            var e = !!y("perspective", "1px", !0),
                t = Modernizr._config.usePrefixes;
            if (e && (!t || "webkitPerspective" in C.style)) {
                var n;
                Modernizr.supports
                    ? (n = "@supports (perspective: 1px)")
                    : ((n = "@media (transform-3d)"),
                      t && (n += ",(-webkit-transform-3d)")),
                    (n +=
                        "{#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}"),
                    A(n, function(t) {
                        e = 9 === t.offsetLeft && 5 === t.offsetHeight;
                    });
            }
            return e;
        }),
        Modernizr.addTest("csstransitions", y("transition", "all", !0)),
        o(),
        i(b),
        delete T.addTest,
        delete T.addAsyncTest;
    for (var O = 0; O < Modernizr._q.length; O++) Modernizr._q[O]();
    e.Modernizr = Modernizr;
})(window, document);
