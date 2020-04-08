var Image360 = (function() {
    var m, f;
    m = f = (function() {
        var B = {
            version: "v3.3.b5",
            UUID: 0,
            storage: {},
            $uuid: function(E) {
                return (E.$J_UUID || (E.$J_UUID = ++w.UUID))
            },
            getStorage: function(E) {
                return (w.storage[E] || (w.storage[E] = {}))
            },
            $F: function() {},
            $false: function() {
                return false
            },
            $true: function() {
                return true
            },
            stylesId: "mjs-" + Math.floor(Math.random() * new Date().getTime()),
            defined: function(E) {
                return (undefined != E)
            },
            ifndef: function(F, E) {
                return (undefined != F) ? F : E
            },
            exists: function(E) {
                return !!(E)
            },
            jTypeOf: function(E) {
                if (!w.defined(E)) {
                    return false
                }
                if (E.$J_TYPE) {
                    return E.$J_TYPE
                }
                if (!!E.nodeType) {
                    if (1 == E.nodeType) {
                        return "element"
                    }
                    if (3 == E.nodeType) {
                        return "textnode"
                    }
                }
                if (E.length && E.item) {
                    return "collection"
                }
                if (E.length && E.callee) {
                    return "arguments"
                }
                if ((E instanceof window.Object || E instanceof window.Function) && E.constructor === w.Class) {
                    return "class"
                }
                if (E instanceof window.Array) {
                    return "array"
                }
                if (E instanceof window.Function) {
                    return "function"
                }
                if (E instanceof window.String) {
                    return "string"
                }
                if (w.jBrowser.trident) {
                    if (w.defined(E.cancelBubble)) {
                        return "event"
                    }
                } else {
                    if (E === window.event || E.constructor == window.Event || E.constructor == window.MouseEvent || E.constructor == window.UIEvent || E.constructor == window.KeyboardEvent || E.constructor == window.KeyEvent) {
                        return "event"
                    }
                }
                if (E instanceof window.Date) {
                    return "date"
                }
                if (E instanceof window.RegExp) {
                    return "regexp"
                }
                if (E === window) {
                    return "window"
                }
                if (E === document) {
                    return "document"
                }
                return typeof(E)
            },
            extend: function(J, I) {
                if (!(J instanceof window.Array)) {
                    J = [J]
                }
                for (var H = 0, F = J.length; H < F; H++) {
                    if (!w.defined(J)) {
                        continue
                    }
                    for (var G in (I || {})) {
                        try {
                            J[H][G] = I[G]
                        } catch (E) {}
                    }
                }
                return J[0]
            },
            implement: function(I, H) {
                if (!(I instanceof window.Array)) {
                    I = [I]
                }
                for (var G = 0, E = I.length; G < E; G++) {
                    if (!w.defined(I[G])) {
                        continue
                    }
                    if (!I[G].prototype) {
                        continue
                    }
                    for (var F in (H || {})) {
                        if (!I[G].prototype[F]) {
                            I[G].prototype[F] = H[F]
                        }
                    }
                }
                return I[0]
            },
            nativize: function(G, F) {
                if (!w.defined(G)) {
                    return G
                }
                for (var E in (F || {})) {
                    if (!G[E]) {
                        G[E] = F[E]
                    }
                }
                return G
            },
            $try: function() {
                for (var F = 0, E = arguments.length; F < E; F++) {
                    try {
                        return arguments[F]()
                    } catch (G) {}
                }
                return null
            },
            $A: function(G) {
                if (!w.defined(G)) {
                    return w.$([])
                }
                if (G.toArray) {
                    return w.$(G.toArray())
                }
                if (G.item) {
                    var F = G.length || 0,
                        E = new Array(F);
                    while (F--) {
                        E[F] = G[F]
                    }
                    return w.$(E)
                }
                return w.$(Array.prototype.slice.call(G))
            },
            now: function() {
                return new Date().getTime()
            },
            detach: function(I) {
                var G;
                switch (w.jTypeOf(I)) {
                    case "object":
                        G = {};
                        for (var H in I) {
                            G[H] = w.detach(I[H])
                        }
                        break;
                    case "array":
                        G = [];
                        for (var F = 0, E = I.length; F < E; F++) {
                            G[F] = w.detach(I[F])
                        }
                        break;
                    default:
                        return I
                }
                return w.$(G)
            },
            $: function(F) {
                if (!w.defined(F)) {
                    return null
                }
                if (F.$J_EXT) {
                    return F
                }
                switch (w.jTypeOf(F)) {
                    case "array":
                        F = w.nativize(F, w.extend(w.Array, {
                            $J_EXT: w.$F
                        }));
                        F.jEach = F.forEach;
                        return F;
                        break;
                    case "string":
                        var E = document.getElementById(F);
                        if (w.defined(E)) {
                            return w.$(E)
                        }
                        return null;
                        break;
                    case "window":
                    case "document":
                        w.$uuid(F);
                        F = w.extend(F, w.Doc);
                        break;
                    case "element":
                        w.$uuid(F);
                        F = w.extend(F, w.Element);
                        break;
                    case "event":
                        F = w.extend(F, w.Event);
                        break;
                    case "textnode":
                        return F;
                        break;
                    case "function":
                    case "array":
                    case "date":
                    default:
                        break
                }
                return w.extend(F, {
                    $J_EXT: w.$F
                })
            },
            $new: function(E, G, F) {
                return w.$(w.doc.createElement(E)).setProps(G || {}).jSetCss(F || {})
            },
            addCSS: function(F, H, L) {
                var I, G, J, K = [],
                    E = -1;
                L || (L = w.stylesId);
                I = w.$(L) || (document.head || document.body).appendChild(w.$new("style", {
                    id: L,
                    type: "text/css"
                }));
                G = I.sheet || I.styleSheet;
                if ("string" != w.jTypeOf(H)) {
                    for (var J in H) {
                        K.push(J + ":" + H[J])
                    }
                    H = K.join(";")
                }
                if (G.insertRule) {
                    E = G.insertRule(F + " {" + H + "}", G.cssRules.length)
                } else {
                    E = G.addRule(F, H)
                }
                return E
            },
            removeCSS: function(H, E) {
                var G, F;
                G = w.$(H);
                if ("element" !== w.jTypeOf(G)) {
                    return
                }
                F = G.sheet || G.styleSheet;
                if (F.deleteRule) {
                    F.deleteRule(E)
                } else {
                    if (F.removeRule) {
                        F.removeRule(E)
                    }
                }
            },
            generateUUID: function() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(G) {
                    var F = Math.random() * 16 | 0,
                        E = G == "x" ? F : (F & 3 | 8);
                    return E.toString(16)
                }).toUpperCase()
            },
            getAbsoluteURL: function(E) {
                if (/^http(s)?:\/\//.test(E)) {
                    return E
                }
                var F = document.createElement("div");
                F.innerHTML = '<a href="' + E + '">x</a>';
                return F.firstChild.href
            },
            getHashCode: function(G) {
                var H = 0,
                    E = G.length;
                for (var F = 0; F < E; ++F) {
                    H = 31 * H + G.charCodeAt(F);
                    H %= 4294967296
                }
                return H
            }
        };
        var w = B;
        var x = B.$;
        if (!window.imageJS) {
            window.imageJS = B;
            window.$mjs = B.$
        }
        w.Array = {
            $J_TYPE: "array",
            indexOf: function(H, I) {
                var E = this.length;
                for (var F = this.length, G = (I < 0) ? Math.max(0, F + I) : I || 0; G < F; G++) {
                    if (this[G] === H) {
                        return G
                    }
                }
                return -1
            },
            contains: function(E, F) {
                return this.indexOf(E, F) != -1
            },
            forEach: function(E, H) {
                for (var G = 0, F = this.length; G < F; G++) {
                    if (G in this) {
                        E.call(H, this[G], G, this)
                    }
                }
            },
            filter: function(E, J) {
                var I = [];
                for (var H = 0, F = this.length; H < F; H++) {
                    if (H in this) {
                        var G = this[H];
                        if (E.call(J, this[H], H, this)) {
                            I.push(G)
                        }
                    }
                }
                return I
            },
            map: function(E, I) {
                var H = [];
                for (var G = 0, F = this.length; G < F; G++) {
                    if (G in this) {
                        H[G] = E.call(I, this[G], G, this)
                    }
                }
                return H
            }
        };
        w.implement(String, {
            $J_TYPE: "string",
            jTrim: function() {
                return this.replace(/^\s+|\s+$/g, "")
            },
            eq: function(E, F) {
                return (F || false) ? (this.toString() === E.toString()) : (this.toLowerCase().toString() === E.toLowerCase().toString())
            },
            jCamelize: function() {
                return this.replace(/-\D/g, function(E) {
                    return E.charAt(1).toUpperCase()
                })
            },
            dashize: function() {
                return this.replace(/[A-Z]/g, function(E) {
                    return ("-" + E.charAt(0).toLowerCase())
                })
            },
            jToInt: function(E) {
                return parseInt(this, E || 10)
            },
            toFloat: function() {
                return parseFloat(this)
            },
            jToBool: function() {
                return !this.replace(/true/i, "").jTrim()
            },
            has: function(F, E) {
                E = E || "";
                return (E + this + E).indexOf(E + F + E) > -1
            }
        });
        B.implement(Function, {
            $J_TYPE: "function",
            jBind: function() {
                var F = w.$A(arguments),
                    E = this,
                    G = F.shift();
                return function() {
                    return E.apply(G || null, F.concat(w.$A(arguments)))
                }
            },
            jBindAsEvent: function() {
                var F = w.$A(arguments),
                    E = this,
                    G = F.shift();
                return function(H) {
                    return E.apply(G || null, w.$([H || window.event]).concat(F))
                }
            },
            jDelay: function() {
                var F = w.$A(arguments),
                    E = this,
                    G = F.shift();
                return window.setTimeout(function() {
                    return E.apply(E, F)
                }, G || 0)
            },
            jDefer: function() {
                var F = w.$A(arguments),
                    E = this;
                return function() {
                    return E.jDelay.apply(E, F)
                }
            },
            interval: function() {
                var F = w.$A(arguments),
                    E = this,
                    G = F.shift();
                return window.setInterval(function() {
                    return E.apply(E, F)
                }, G || 0)
            }
        });
        var v = navigator.userAgent.toLowerCase(),
            u = v.match(/(webkit|gecko|trident|presto)\/(\d+\.?\d*)/i),
            z = v.match(/(chrome|safari|firefox|opera)\/(\d+\.?\d*)/i),
            q = document.documentElement.style;

        function r(F) {
            var E = F.charAt(0).toUpperCase() + F.slice(1);
            return F in q || ("Webkit" + E) in q || ("Moz" + E) in q || ("ms" + E) in q || ("O" + E) in q
        }
        w.jBrowser = {
            features: {
                xpath: !!(document.evaluate),
                air: !!(window.runtime),
                query: !!(document.querySelector),
                fullScreen: !!(document.fullscreenEnabled || document.msFullscreenEnabled || document.exitFullscreen || document.cancelFullScreen || document.webkitexitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.oCancelFullScreen || document.msCancelFullScreen),
                xhr2: !!(window.ProgressEvent) && !!(window.FormData) && (window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest),
                transition: r("transition"),
                transform: r("transform"),
                animation: r("animation"),
                multibackground: false,
                requestAnimationFrame: false
            },
            touchScreen: function() {
                return "ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch)
            }(),
            mobile: v.match(/(android|bb\d+|meego).+|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(jBrowser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/) ? true : false,
            engine: (u && u[1]) ? u[1].toLowerCase() : (window.opera) ? "presto" : !!(window.ActiveXObject) ? "trident" : (undefined !== document.getBoxObjectFor || null != window.mozInnerScreenY) ? "gecko" : (null !== window.WebKitPoint || !navigator.taintEnabled) ? "webkit" : "unknown",
            version: (u && u[2]) ? parseFloat(u[2]) : 0,
            cssPrefix: "",
            cssDomPrefix: "",
            domPrefix: "",
            ieMode: 0,
            platform: v.match(/ip(?:ad|od|hone)/) ? "ios" : (v.match(/(?:webos|android)/) || navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase(),
            backCompat: document.compatMode && "backcompat" == document.compatMode.toLowerCase(),
            scrollbarsWidth: 0,
            getDoc: function() {
                return (document.compatMode && "backcompat" == document.compatMode.toLowerCase()) ? document.body : document.documentElement
            },
            requestAnimationFrame: window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || undefined,
            cancelAnimationFrame: window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || undefined,
            ready: false,
            onready: function() {
                if (w.jBrowser.ready) {
                    return
                }
                var H, G;
                w.jBrowser.ready = true;
                w.body = w.$(document.body);
                w.win = w.$(window);
                try {
                    var F = w.$new("div").jSetCss({
                        width: 100,
                        height: 100,
                        overflow: "scroll",
                        position: "absolute",
                        top: -9999
                    }).jAppendTo(w.body);
                    w.jBrowser.scrollbarsWidth = F.offsetWidth - F.clientWidth;
                    F.jRemove()
                } catch (E) {}
                try {
                    H = w.$new("div"), G = H.style;
                    G.cssText = "background:url(https://),url(https://),red url(https://)";
                    w.jBrowser.features.multibackground = (/(url\s*\(.*?){3}/).test(G.background);
                    G = null;
                    H = null
                } catch (E) {}
                w.Doc.jCallEvent.call(w.$(document), "domready")
            }
        };
        (function() {
            var H = [],
                I, G, F;

            function E() {
                return !!(arguments.callee.caller)
            }
            switch (w.jBrowser.engine) {
                case "trident":
                    if (!w.jBrowser.version) {
                        w.jBrowser.version = !!(window.XMLHttpRequest) ? 3 : 2
                    }
                    break;
                case "gecko":
                    w.jBrowser.version = (z && z[2]) ? parseFloat(z[2]) : 0;
                    break
            }
            w.jBrowser[w.jBrowser.engine] = true;
            if (window.chrome) {
                w.jBrowser.chrome = true
            }
            I = ({
                gecko: ["-moz-", "Moz", "moz"],
                webkit: ["-webkit-", "Webkit", "webkit"],
                trident: ["-ms-", "ms", "ms"],
                presto: ["-o-", "O", "o"]
            })[w.jBrowser.engine] || ["", "", ""];
            w.jBrowser.cssPrefix = I[0];
            w.jBrowser.cssDomPrefix = I[1];
            w.jBrowser.domPrefix = I[2];
            w.jBrowser.ieMode = (!w.jBrowser.trident) ? 0 : (document.documentMode) ? document.documentMode : function() {
                var J = 0;
                if (w.jBrowser.backCompat) {
                    return 5
                }
                switch (w.jBrowser.version) {
                    case 2:
                        J = 6;
                        break;
                    case 3:
                        J = 7;
                        break
                }
                return J
            }();
            if (w.jBrowser.ieMode) {
                H.push("ie" + w.jBrowser.ieMode + "-image");
                for (G = 11; G > w.jBrowser.ieMode; G--) {
                    H.push("lt-ie" + G + "-image")
                }
                F = (document.documentElement.className || "").match(/\S+/g) || [];
                document.documentElement.className = w.$(F).concat(H).join(" ")
            }
            if (w.jBrowser.webkit && w.jBrowser.version < 536) {
                w.jBrowser.features.fullScreen = false
            }
            if (w.jBrowser.requestAnimationFrame) {
                w.jBrowser.requestAnimationFrame.call(window, function() {
                    w.jBrowser.features.requestAnimationFrame = true
                })
            }
        })();
        (function() {
            w.jBrowser.fullScreen = {
                capable: w.jBrowser.features.fullScreen,
                enabled: function() {
                    return !!(document.fullscreenElement || document[w.jBrowser.domPrefix + "FullscreenElement"] || document.fullScreen || document.webkitIsFullScreen || document[w.jBrowser.domPrefix + "FullScreen"])
                },
                request: function(E, F) {
                    F || (F = {});
                    if (this.capable) {
                        w.$(document).jAddEvent(this.changeEventName, this.onchange = function(G) {
                            if (this.enabled()) {
                                F.onEnter && F.onEnter()
                            } else {
                                w.$(document).jRemoveEvent(this.changeEventName, this.onchange);
                                F.onExit && F.onExit()
                            }
                        }.jBindAsEvent(this));
                        w.$(document).jAddEvent(this.errorEventName, this.onerror = function(G) {
                            F.fallback && F.fallback();
                            w.$(document).jRemoveEvent(this.errorEventName, this.onerror)
                        }.jBindAsEvent(this));
                        (E[w.jBrowser.domPrefix + "RequestFullscreen"] || E[w.jBrowser.domPrefix + "RequestFullScreen"] || E.requestFullscreen || function() {}).call(E)
                    } else {
                        if (F.fallback) {
                            F.fallback()
                        }
                    }
                },
                cancel: (document.exitFullscreen || document.cancelFullScreen || document[w.jBrowser.domPrefix + "ExitFullscreen"] || document[w.jBrowser.domPrefix + "CancelFullScreen"] || function() {}).jBind(document),
                changeEventName: document.msExitFullscreen ? "MSFullscreenChange" : (document.exitFullscreen ? "" : w.jBrowser.domPrefix) + "fullscreenchange",
                errorEventName: document.msExitFullscreen ? "MSFullscreenError" : (document.exitFullscreen ? "" : w.jBrowser.domPrefix) + "fullscreenerror",
                prefix: w.jBrowser.domPrefix,
                activeElement: null
            }
        })();
        var D = /\S+/g,
            t = /^(border(Top|Bottom|Left|Right)Width)|((padding|margin)(Top|Bottom|Left|Right))$/,
            y = {
                "float": ("undefined" === typeof(q.styleFloat)) ? "cssFloat" : "styleFloat"
            },
            A = {
                fontWeight: true,
                lineHeight: true,
                opacity: true,
                zIndex: true,
                zoom: true
            },
            s = (window.getComputedStyle) ? function(G, E) {
                var F = window.getComputedStyle(G, null);
                return F ? F.getPropertyValue(E) || F[E] : null
            } : function(H, F) {
                var G = this.currentStyle,
                    E = null;
                E = G ? G[F] : null;
                if (null == E && H.style && H.style[F]) {
                    E = H.style[F]
                }
                return E
            };

        function C(F) {
            var E;
            if (!(F in q)) {
                E = w.jBrowser.cssDomPrefix + F.charAt(0).toUpperCase() + F.slice(1);
                if (E in q) {
                    return E
                }
            }
            return F
        }
        w.normalizeCSS = C;
        w.Element = {
            jHasClass: function(E) {
                return !(E || "").has(" ") && (this.className || "").has(E, " ")
            },
            jAddClass: function(I) {
                var F = (this.className || "").match(D) || [],
                    H = (I || "").match(D) || [],
                    E = H.length,
                    G = 0;
                for (; G < E; G++) {
                    if (!w.$(F).contains(H[G])) {
                        F.push(H[G])
                    }
                }
                this.className = F.join(" ");
                return this
            },
            jRemoveClass: function(J) {
                var F = (this.className || "").match(D) || [],
                    I = (J || "").match(D) || [],
                    E = I.length,
                    H = 0,
                    G;
                for (; H < E; H++) {
                    if ((G = w.$(F).indexOf(I[H])) > -1) {
                        F.splice(G, 1)
                    }
                }
                this.className = J ? F.join(" ") : "";
                return this
            },
            jToggleClass: function(E) {
                return this.jHasClass(E) ? this.jRemoveClass(E) : this.jAddClass(E)
            },
            jGetCss: function(F) {
                var G = F.jCamelize(),
                    E = null;
                F = y[G] || (y[G] = C(G));
                E = s(this, F);
                if ("auto" === E) {
                    E = null
                }
                if (null !== E) {
                    if ("opacity" == F) {
                        return w.defined(E) ? parseFloat(E) : 1
                    }
                    if (t.test(F)) {
                        E = parseInt(E, 10) ? E : "0px"
                    }
                }
                return E
            },
            jSetCssProp: function(F, E) {
                var H = F.jCamelize();
                try {
                    if ("opacity" == F) {
                        this.jSetOpacity(E);
                        return this
                    }
                    F = y[H] || (y[H] = C(H));
                    this.style[F] = E + (("number" == w.jTypeOf(E) && !A[H]) ? "px" : "")
                } catch (G) {}
                return this
            },
            jSetCss: function(F) {
                for (var E in F) {
                    this.jSetCssProp(E, F[E])
                }
                return this
            },
            jGetStyles: function() {
                var E = {};
                w.$A(arguments).jEach(function(F) {
                    E[F] = this.jGetCss(F)
                }, this);
                return E
            },
            jSetOpacity: function(H, F) {
                var G;
                F = F || false;
                H = parseFloat(H);
                if (F) {
                    if (0 === H) {
                        if ("hidden" != this.style.visibility) {
                            this.style.visibility = "hidden"
                        }
                    } else {
                        if ("visible" != this.style.visibility) {
                            this.style.visibility = "visible"
                        }
                    }
                }
                if (w.jBrowser.ieMode && w.jBrowser.ieMode < 9) {
                    if (!this.currentStyle || !this.currentStyle.hasLayout) {
                        this.style.zoom = 1
                    }
                    try {
                        G = this.filters.item("DXImageTransform.Microsoft.Alpha");
                        G.enabled = (1 != H);
                        G.opacity = H * 100
                    } catch (E) {
                        G = this.currentStyle && this.currentStyle.filter || this.style.filter || "";
                        G += (1 == H) ? "" : " progid:DXImageTransform.Microsoft.Alpha(enabled=true,opacity=" + H * 100 + ")";
                        this.style.filter = G
                    }
                }
                this.style.opacity = H;
                return this
            },
            setProps: function(E) {
                for (var F in E) {
                    if ("class" === F) {
                        this.jAddClass("" + E[F])
                    } else {
                        this.setAttribute(F, "" + E[F])
                    }
                }
                return this
            },
            hide: function() {
                return this.jSetCss({
                    display: "none",
                    visibility: "hidden"
                })
            },
            show: function() {
                return this.jSetCss({
                    display: "",
                    visibility: "visible"
                })
            },
            jGetSize: function() {
                return {
                    width: this.offsetWidth,
                    height: this.offsetHeight
                }
            },
            getInnerSize: function(F) {
                var E = this.jGetSize();
                E.width -= (parseFloat(this.jGetCss("border-left-width") || 0) + parseFloat(this.jGetCss("border-right-width") || 0));
                E.height -= (parseFloat(this.jGetCss("border-top-width") || 0) + parseFloat(this.jGetCss("border-bottom-width") || 0));
                if (!F) {
                    E.width -= (parseFloat(this.jGetCss("padding-left") || 0) + parseFloat(this.jGetCss("padding-right") || 0));
                    E.height -= (parseFloat(this.jGetCss("padding-top") || 0) + parseFloat(this.jGetCss("padding-bottom") || 0))
                }
                return E
            },
            jGetScroll: function() {
                return {
                    top: this.scrollTop,
                    left: this.scrollLeft
                }
            },
            jGetFullScroll: function() {
                var E = this,
                    F = {
                        top: 0,
                        left: 0
                    };
                do {
                    F.left += E.scrollLeft || 0;
                    F.top += E.scrollTop || 0;
                    E = E.parentNode
                } while (E);
                return F
            },
            jGetPosition: function() {
                var I = this,
                    F = 0,
                    H = 0;
                if (w.defined(document.documentElement.getBoundingClientRect)) {
                    var E = this.getBoundingClientRect(),
                        G = w.$(document).jGetScroll(),
                        J = w.jBrowser.getDoc();
                    return {
                        top: E.top + G.y - J.clientTop,
                        left: E.left + G.x - J.clientLeft
                    }
                }
                do {
                    F += I.offsetLeft || 0;
                    H += I.offsetTop || 0;
                    I = I.offsetParent
                } while (I && !(/^(?:body|html)$/i).test(I.tagName));
                return {
                    top: H,
                    left: F
                }
            },
            jGetRect: function() {
                var F = this.jGetPosition();
                var E = this.jGetSize();
                return {
                    top: F.top,
                    bottom: F.top + E.height,
                    left: F.left,
                    right: F.left + E.width
                }
            },
            changeContent: function(F) {
                try {
                    this.innerHTML = F
                } catch (E) {
                    this.innerText = F
                }
                return this
            },
            jRemove: function() {
                return (this.parentNode) ? this.parentNode.removeChild(this) : this
            },
            kill: function() {
                w.$A(this.childNodes).jEach(function(E) {
                    if (3 == E.nodeType || 8 == E.nodeType) {
                        return
                    }
                    w.$(E).kill()
                });
                this.jRemove();
                this.jClearEvents();
                if (this.$J_UUID) {
                    w.storage[this.$J_UUID] = null;
                    delete w.storage[this.$J_UUID]
                }
                return null
            },
            append: function(G, F) {
                F = F || "bottom";
                var E = this.firstChild;
                ("top" == F && E) ? this.insertBefore(G, E): this.appendChild(G);
                return this
            },
            jAppendTo: function(G, F) {
                var E = w.$(G).append(this, F);
                return this
            },
            enclose: function(E) {
                this.append(E.parentNode.replaceChild(this, E));
                return this
            },
            hasChild: function(E) {
                if ("element" !== w.jTypeOf("string" == w.jTypeOf(E) ? E = document.getElementById(E) : E)) {
                    return false
                }
                return (this == E) ? false : (this.contains && !(w.jBrowser.webkit419)) ? (this.contains(E)) : (this.compareDocumentPosition) ? !!(this.compareDocumentPosition(E) & 16) : w.$A(this.byTag(E.tagName)).contains(E)
            }
        };
        w.Element.jGetStyle = w.Element.jGetCss;
        w.Element.jSetStyle = w.Element.jSetCss;
        if (!window.Element) {
            window.Element = w.$F;
            if (w.jBrowser.engine.webkit) {
                window.document.createElement("iframe")
            }
            window.Element.prototype = (w.jBrowser.engine.webkit) ? window["[[DOMElement.prototype]]"] : {}
        }
        w.implement(window.Element, {
            $J_TYPE: "element"
        });
        w.Doc = {
            jGetSize: function() {
                if (w.jBrowser.touchScreen || w.jBrowser.presto925 || w.jBrowser.webkit419) {
                    return {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }
                return {
                    width: w.jBrowser.getDoc().clientWidth,
                    height: w.jBrowser.getDoc().clientHeight
                }
            },
            jGetScroll: function() {
                return {
                    x: window.pageXOffset || w.jBrowser.getDoc().scrollLeft,
                    y: window.pageYOffset || w.jBrowser.getDoc().scrollTop
                }
            },
            jGetFullSize: function() {
                var E = this.jGetSize();
                return {
                    width: Math.max(w.jBrowser.getDoc().scrollWidth, E.width),
                    height: Math.max(w.jBrowser.getDoc().scrollHeight, E.height)
                }
            }
        };
        w.extend(document, {
            $J_TYPE: "document"
        });
        w.extend(window, {
            $J_TYPE: "window"
        });
        w.extend([w.Element, w.Doc], {
            jFetch: function(H, F) {
                var E = w.getStorage(this.$J_UUID),
                    G = E[H];
                if (undefined !== F && undefined === G) {
                    G = E[H] = F
                }
                return (w.defined(G) ? G : null)
            },
            jStore: function(G, F) {
                var E = w.getStorage(this.$J_UUID);
                E[G] = F;
                return this
            },
            jDel: function(F) {
                var E = w.getStorage(this.$J_UUID);
                delete E[F];
                return this
            }
        });
        if (!(window.HTMLElement && window.HTMLElement.prototype && window.HTMLElement.prototype.getElementsByClassName)) {
            w.extend([w.Element, w.Doc], {
                getElementsByClassName: function(E) {
                    return w.$A(this.getElementsByTagName("*")).filter(function(G) {
                        try {
                            return (1 == G.nodeType && G.className.has(E, " "))
                        } catch (F) {}
                    })
                }
            })
        }
        w.extend([w.Element, w.Doc], {
            byClass: function() {
                return this.getElementsByClassName(arguments[0])
            },
            byTag: function() {
                return this.getElementsByTagName(arguments[0])
            }
        });
        if (w.jBrowser.fullScreen.capable && !document.requestFullScreen) {
            w.Element.requestFullScreen = function() {
                w.jBrowser.fullScreen.request(this)
            }
        }
        w.Event = {
            $J_TYPE: "event",
            isQueueStopped: w.$false,
            stop: function() {
                return this.stopDistribution().stopDefaults()
            },
            stopDistribution: function() {
                if (this.stopPropagation) {
                    this.stopPropagation()
                } else {
                    this.cancelBubble = true
                }
                return this
            },
            stopDefaults: function() {
                if (this.preventDefault) {
                    this.preventDefault()
                } else {
                    this.returnValue = false
                }
                return this
            },
            stopQueue: function() {
                this.isQueueStopped = w.$true;
                return this
            },
            jGetPageXY: function() {
                var F, E;
                F = ((/touch/i).test(this.type)) ? this.changedTouches[0] : this;
                return (!w.defined(F)) ? {
                    x: 0,
                    y: 0
                } : {
                    x: F.pageX || F.clientX + w.jBrowser.getDoc().scrollLeft,
                    y: F.pageY || F.clientY + w.jBrowser.getDoc().scrollTop
                }
            },
            getTarget: function() {
                var E = this.target || this.srcElement;
                while (E && 3 == E.nodeType) {
                    E = E.parentNode
                }
                return E
            },
            getRelated: function() {
                var F = null;
                switch (this.type) {
                    case "mouseover":
                    case "pointerover":
                    case "MSPointerOver":
                        F = this.relatedTarget || this.fromElement;
                        break;
                    case "mouseout":
                    case "pointerout":
                    case "MSPointerOut":
                        F = this.relatedTarget || this.toElement;
                        break;
                    default:
                        return F
                }
                try {
                    while (F && 3 == F.nodeType) {
                        F = F.parentNode
                    }
                } catch (E) {
                    F = null
                }
                return F
            },
            getButton: function() {
                if (!this.which && this.button !== undefined) {
                    return (this.button & 1 ? 1 : (this.button & 2 ? 3 : (this.button & 4 ? 2 : 0)))
                }
                return this.which
            }
        };
        w._event_add_ = "addEventListener";
        w._event_del_ = "removeEventListener";
        w._event_prefix_ = "";
        if (!document.addEventListener) {
            w._event_add_ = "attachEvent";
            w._event_del_ = "detachEvent";
            w._event_prefix_ = "on"
        }
        w.Event.Custom = {
            type: "",
            x: null,
            y: null,
            timeStamp: null,
            button: null,
            target: null,
            relatedTarget: null,
            $J_TYPE: "event.custom",
            isQueueStopped: w.$false,
            events: w.$([]),
            pushToEvents: function(E) {
                var F = E;
                this.events.push(F)
            },
            stop: function() {
                return this.stopDistribution().stopDefaults()
            },
            stopDistribution: function() {
                this.events.jEach(function(F) {
                    try {
                        F.stopDistribution()
                    } catch (E) {}
                });
                return this
            },
            stopDefaults: function() {
                this.events.jEach(function(F) {
                    try {
                        F.stopDefaults()
                    } catch (E) {}
                });
                return this
            },
            stopQueue: function() {
                this.isQueueStopped = w.$true;
                return this
            },
            jGetPageXY: function() {
                return {
                    x: this.x,
                    y: this.y
                }
            },
            getTarget: function() {
                return this.target
            },
            getRelated: function() {
                return this.relatedTarget
            },
            getButton: function() {
                return this.button
            },
            getOriginalTarget: function() {
                return this.events.length > 0 ? this.events[0].getTarget() : undefined
            }
        };
        w.extend([w.Element, w.Doc], {
            jAddEvent: function(G, I, J, M) {
                var L, E, H, K, F;
                if ("string" == w.jTypeOf(G)) {
                    F = G.split(" ");
                    if (F.length > 1) {
                        G = F
                    }
                }
                if (w.jTypeOf(G) == "array") {
                    w.$(G).jEach(this.jAddEvent.jBindAsEvent(this, I, J, M));
                    return this
                }
                if (!G || !I || w.jTypeOf(G) != "string" || w.jTypeOf(I) != "function") {
                    return this
                }
                if (G == "domready" && w.jBrowser.ready) {
                    I.call(this);
                    return this
                }
                J = parseInt(J || 50);
                if (!I.$J_EUID) {
                    I.$J_EUID = Math.floor(Math.random() * w.now())
                }
                L = w.Doc.jFetch.call(this, "_EVENTS_", {});
                E = L[G];
                if (!E) {
                    L[G] = E = w.$([]);
                    H = this;
                    if (w.Event.Custom[G]) {
                        w.Event.Custom[G].handler.add.call(this, M)
                    } else {
                        E.handle = function(N) {
                            N = w.extend(N || window.e, {
                                $J_TYPE: "event"
                            });
                            w.Doc.jCallEvent.call(H, G, w.$(N))
                        };
                        this[w._event_add_](w._event_prefix_ + G, E.handle, false)
                    }
                }
                K = {
                    type: G,
                    fn: I,
                    priority: J,
                    euid: I.$J_EUID
                };
                E.push(K);
                E.sort(function(O, N) {
                    return O.priority - N.priority
                });
                return this
            },
            jRemoveEvent: function(K) {
                var I = w.Doc.jFetch.call(this, "_EVENTS_", {}),
                    G, E, F, L, J, H;
                if ("string" == w.jTypeOf(K)) {
                    H = K.split(" ");
                    if (H.length > 1) {
                        K = H
                    }
                }
                if (w.jTypeOf(K) == "array") {
                    w.$(K).jEach(this.jRemoveEvent.jBindAsEvent(this, arguments[1]));
                    return this
                }
                if (!K || w.jTypeOf(K) != "string" || !I || !I[K]) {
                    return this
                }
                G = I[K] || [];
                J = arguments[1] || null;
                for (F = 0; F < G.length; F++) {
                    E = G[F];
                    if (!J || J.$J_EUID === E.euid) {
                        L = G.splice(F--, 1)
                    }
                }
                if (0 === G.length) {
                    if (w.Event.Custom[K]) {
                        w.Event.Custom[K].handler.jRemove.call(this)
                    } else {
                        this[w._event_del_](w._event_prefix_ + K, G.handle, false)
                    }
                    delete I[K]
                }
                return this
            },
            jCallEvent: function(I, K) {
                var H = w.Doc.jFetch.call(this, "_EVENTS_", {}),
                    G, E, F;
                if (!I || w.jTypeOf(I) != "string" || !H || !H[I]) {
                    return this
                }
                try {
                    K = w.extend(K || {}, {
                        type: I
                    })
                } catch (J) {}
                if (undefined === K.timeStamp) {
                    K.timeStamp = w.now()
                }
                G = H[I] || [];
                for (F = 0; F < G.length && !(K.isQueueStopped && K.isQueueStopped()); F++) {
                    G[F].fn.call(this, K)
                }
            },
            jRaiseEvent: function(F, E) {
                var I = ("domready" == F) ? false : true,
                    H = this,
                    G;
                if (!I) {
                    w.Doc.jCallEvent.call(this, F);
                    return this
                }
                if (H === document && document.createEvent && !H.dispatchEvent) {
                    H = document.documentElement
                }
                if (document.createEvent) {
                    G = document.createEvent(F);
                    G.initEvent(E, true, true)
                } else {
                    G = document.createEventObject();
                    G.eventType = F
                }
                if (document.createEvent) {
                    H.dispatchEvent(G)
                } else {
                    H.fireEvent("on" + E, G)
                }
                return G
            },
            jClearEvents: function() {
                var F = w.Doc.jFetch.call(this, "_EVENTS_");
                if (!F) {
                    return this
                }
                for (var E in F) {
                    w.Doc.jRemoveEvent.call(this, E)
                }
                w.Doc.jDel.call(this, "_EVENTS_");
                return this
            }
        });
        (function(E) {
            if ("complete" === document.readyState) {
                return E.jBrowser.onready.jDelay(1)
            }
            if (E.jBrowser.webkit && E.jBrowser.version < 420) {
                (function() {
                    (E.$(["loaded", "complete"]).contains(document.readyState)) ? E.jBrowser.onready(): arguments.callee.jDelay(50)
                })()
            } else {
                if (E.jBrowser.trident && E.jBrowser.ieMode < 9 && window == top) {
                    (function() {
                        (E.$try(function() {
                            E.jBrowser.getDoc().doScroll("left");
                            return true
                        })) ? E.jBrowser.onready(): arguments.callee.jDelay(50)
                    })()
                } else {
                    E.Doc.jAddEvent.call(E.$(document), "DOMContentLoaded", E.jBrowser.onready);
                    E.Doc.jAddEvent.call(E.$(window), "load", E.jBrowser.onready)
                }
            }
        })(B);
        w.Class = function() {
            var I = null,
                F = w.$A(arguments);
            if ("class" == w.jTypeOf(F[0])) {
                I = F.shift()
            }
            var E = function() {
                for (var L in this) {
                    this[L] = w.detach(this[L])
                }
                if (this.constructor.$parent) {
                    this.$parent = {};
                    var N = this.constructor.$parent;
                    for (var M in N) {
                        var K = N[M];
                        switch (w.jTypeOf(K)) {
                            case "function":
                                this.$parent[M] = w.Class.wrap(this, K);
                                break;
                            case "object":
                                this.$parent[M] = w.detach(K);
                                break;
                            case "array":
                                this.$parent[M] = w.detach(K);
                                break
                        }
                    }
                }
                var J = (this.init) ? this.init.apply(this, arguments) : this;
                delete this.caller;
                return J
            };
            if (!E.prototype.init) {
                E.prototype.init = w.$F
            }
            if (I) {
                var H = function() {};
                H.prototype = I.prototype;
                E.prototype = new H;
                E.$parent = {};
                for (var G in I.prototype) {
                    E.$parent[G] = I.prototype[G]
                }
            } else {
                E.$parent = null
            }
            E.constructor = w.Class;
            E.prototype.constructor = E;
            w.extend(E.prototype, F[0]);
            w.extend(E, {
                $J_TYPE: "class"
            });
            return E
        };
        B.Class.wrap = function(E, F) {
            return function() {
                var H = this.caller;
                var G = F.apply(E, arguments);
                return G
            }
        };
        w.Event.Custom.btnclick = new w.Class(w.extend(w.Event.Custom, {
            type: "btnclick",
            init: function(G, F) {
                var E = F.jGetPageXY();
                this.x = E.x;
                this.y = E.y;
                this.timeStamp = F.timeStamp;
                this.button = F.getButton();
                this.target = G;
                this.pushToEvents(F)
            }
        }));
        w.Event.Custom.btnclick.handler = {
            options: {
                threshold: 200,
                button: 1
            },
            add: function(E) {
                this.jStore("event:btnclick:options", w.extend(w.detach(w.Event.Custom.btnclick.handler.options), E || {}));
                this.jAddEvent("mousedown", w.Event.Custom.btnclick.handler.handle, 1);
                this.jAddEvent("mouseup", w.Event.Custom.btnclick.handler.handle, 1);
                this.jAddEvent("click", w.Event.Custom.btnclick.handler.onclick, 1);
                if (w.jBrowser.trident && w.jBrowser.ieMode < 9) {
                    this.jAddEvent("dblclick", w.Event.Custom.btnclick.handler.handle, 1)
                }
            },
            jRemove: function() {
                this.jRemoveEvent("mousedown", w.Event.Custom.btnclick.handler.handle);
                this.jRemoveEvent("mouseup", w.Event.Custom.btnclick.handler.handle);
                this.jRemoveEvent("click", w.Event.Custom.btnclick.handler.onclick);
                if (w.jBrowser.trident && w.jBrowser.ieMode < 9) {
                    this.jRemoveEvent("dblclick", w.Event.Custom.btnclick.handler.handle)
                }
            },
            onclick: function(E) {
                E.stopDefaults()
            },
            handle: function(H) {
                var G, E, F;
                E = this.jFetch("event:btnclick:options");
                if (H.type != "dblclick" && H.getButton() != E.button) {
                    return
                }
                if ("mousedown" == H.type) {
                    G = new w.Event.Custom.btnclick(this, H);
                    this.jStore("event:btnclick:btnclickEvent", G)
                } else {
                    if ("mouseup" == H.type) {
                        G = this.jFetch("event:btnclick:btnclickEvent");
                        if (!G) {
                            return
                        }
                        F = H.jGetPageXY();
                        this.jDel("event:btnclick:btnclickEvent");
                        G.pushToEvents(H);
                        if (H.timeStamp - G.timeStamp <= E.threshold && G.x == F.x && G.y == F.y) {
                            this.jCallEvent("btnclick", G)
                        }
                    } else {
                        if (H.type == "dblclick") {
                            G = new w.Event.Custom.btnclick(this, H);
                            this.jCallEvent("btnclick", G)
                        }
                    }
                }
            }
        };
        w.Event.Custom.mousedrag = new w.Class(w.extend(w.Event.Custom, {
            type: "mousedrag",
            state: "dragstart",
            init: function(H, G, F) {
                var E = G.jGetPageXY();
                this.x = E.x;
                this.y = E.y;
                this.timeStamp = G.timeStamp;
                this.button = G.getButton();
                this.target = H;
                this.pushToEvents(G);
                this.state = F
            }
        }));
        w.Event.Custom.mousedrag.handler = {
            add: function() {
                this.jAddEvent("mousedown", w.Event.Custom.mousedrag.handler.handleMouseDown, 1);
                this.jAddEvent("mouseup", w.Event.Custom.mousedrag.handler.handleMouseUp, 1);
                this.jAddEvent("mousemove", w.Event.Custom.mousedrag.handler.handleMouseMove, 1);
                document.jAddEvent("mouseup", w.Event.Custom.mousedrag.handler.handleMouseUp.jBindAsEvent(this), 1)
            },
            jRemove: function() {
                this.jRemoveEvent("mousedown", w.Event.Custom.mousedrag.handler.handleMouseDown);
                this.jRemoveEvent("mouseup", w.Event.Custom.mousedrag.handler.handleMouseUp);
                this.jRemoveEvent("mousemove", w.Event.Custom.mousedrag.handler.handleMouseMove);
                document.jRemoveEvent("mouseup", w.Event.Custom.mousedrag.handler.handleMouseUp)
            },
            handleMouseDown: function(F) {
                var E;
                F.stopDefaults();
                E = new w.Event.Custom.mousedrag(this, F, "dragstart");
                this.jStore("event:mousedrag:dragstart", E);
                this.jCallEvent("mousedrag", E)
            },
            handleMouseUp: function(F) {
                var E;
                F.stopDefaults();
                E = this.jFetch("event:mousedrag:dragstart");
                if (!E) {
                    return
                }
                E = new w.Event.Custom.mousedrag(this, F, "dragend");
                this.jDel("event:mousedrag:dragstart");
                this.jCallEvent("mousedrag", E)
            },
            handleMouseMove: function(F) {
                var E;
                F.stopDefaults();
                E = this.jFetch("event:mousedrag:dragstart");
                if (!E) {
                    return
                }
                E = new w.Event.Custom.mousedrag(this, F, "dragmove");
                this.jCallEvent("mousedrag", E)
            }
        };
        w.Event.Custom.dblbtnclick = new w.Class(w.extend(w.Event.Custom, {
            type: "dblbtnclick",
            timedout: false,
            tm: null,
            init: function(G, F) {
                var E = F.jGetPageXY();
                this.x = E.x;
                this.y = E.y;
                this.timeStamp = F.timeStamp;
                this.button = F.getButton();
                this.target = G;
                this.pushToEvents(F)
            }
        }));
        w.Event.Custom.dblbtnclick.handler = {
            options: {
                threshold: 200
            },
            add: function(E) {
                this.jStore("event:dblbtnclick:options", w.extend(w.detach(w.Event.Custom.dblbtnclick.handler.options), E || {}));
                this.jAddEvent("btnclick", w.Event.Custom.dblbtnclick.handler.handle, 1)
            },
            jRemove: function() {
                this.jRemoveEvent("btnclick", w.Event.Custom.dblbtnclick.handler.handle)
            },
            handle: function(G) {
                var F, E;
                F = this.jFetch("event:dblbtnclick:event");
                E = this.jFetch("event:dblbtnclick:options");
                if (!F) {
                    F = new w.Event.Custom.dblbtnclick(this, G);
                    F.tm = setTimeout(function() {
                        F.timedout = true;
                        G.isQueueStopped = w.$false;
                        this.jCallEvent("btnclick", G)
                    }.jBind(this), E.threshold + 10);
                    this.jStore("event:dblbtnclick:event", F);
                    G.stopQueue()
                } else {
                    clearTimeout(F.tm);
                    this.jDel("event:dblbtnclick:event");
                    if (!F.timedout) {
                        F.pushToEvents(G);
                        G.stopQueue().stop();
                        this.jCallEvent("dblbtnclick", F)
                    } else {}
                }
            }
        };
        (function(K) {
            var J = K.$;

            function E(L) {
                return L.pointerType ? (("touch" === L.pointerType || L.MSPOINTER_TYPE_TOUCH === L.pointerType) && L.isPrimary) : 1 === L.changedTouches.length && (L.targetTouches.length ? L.targetTouches[0].identifier == L.changedTouches[0].identifier : true)
            }

            function G(L) {
                if (L.pointerType) {
                    return ("touch" === L.pointerType || L.MSPOINTER_TYPE_TOUCH === L.pointerType) ? L.pointerId : null
                } else {
                    return L.changedTouches[0].identifier
                }
            }

            function H(L) {
                if (L.pointerType) {
                    return ("touch" === L.pointerType || L.MSPOINTER_TYPE_TOUCH === L.pointerType) ? L : null
                } else {
                    return L.changedTouches[0]
                }
            }
            K.Event.Custom.tap = new K.Class(K.extend(K.Event.Custom, {
                type: "tap",
                id: null,
                init: function(M, L) {
                    var N = H(L);
                    this.id = N.pointerId || N.identifier;
                    this.x = N.pageX;
                    this.y = N.pageY;
                    this.pageX = N.pageX;
                    this.pageY = N.pageY;
                    this.clientX = N.clientX;
                    this.clientY = N.clientY;
                    this.timeStamp = L.timeStamp;
                    this.button = 0;
                    this.target = M;
                    this.pushToEvents(L)
                }
            }));
            var F = 10,
                I = 200;
            K.Event.Custom.tap.handler = {
                add: function(L) {
                    this.jAddEvent(["touchstart", window.navigator.pointerEnabled ? "pointerdown" : "MSPointerDown"], K.Event.Custom.tap.handler.onTouchStart, 1);
                    this.jAddEvent(["touchend", window.navigator.pointerEnabled ? "pointerup" : "MSPointerUp"], K.Event.Custom.tap.handler.onTouchEnd, 1);
                    this.jAddEvent("click", K.Event.Custom.tap.handler.onClick, 1)
                },
                jRemove: function() {
                    this.jRemoveEvent(["touchstart", window.navigator.pointerEnabled ? "pointerdown" : "MSPointerDown"], K.Event.Custom.tap.handler.onTouchStart);
                    this.jRemoveEvent(["touchend", window.navigator.pointerEnabled ? "pointerup" : "MSPointerUp"], K.Event.Custom.tap.handler.onTouchEnd);
                    this.jRemoveEvent("click", K.Event.Custom.tap.handler.onClick)
                },
                onClick: function(L) {
                    L.stopDefaults()
                },
                onTouchStart: function(L) {
                    if (!E(L)) {
                        this.jDel("event:tap:event");
                        return
                    }
                    L.stopDefaults();
                    this.jStore("event:tap:event", new K.Event.Custom.tap(this, L))
                },
                onTouchEnd: function(O) {
                    var M = K.now(),
                        N = this.jFetch("event:tap:event"),
                        L = this.jFetch("event:tap:options");
                    if (!N || !E(O)) {
                        return
                    }
                    this.jDel("event:tap:event");
                    if (N.id == G(O) && O.timeStamp - N.timeStamp <= I && Math.sqrt(Math.pow(H(O).pageX - N.x, 2) + Math.pow(H(O).pageY - N.y, 2)) <= F) {
                        this.jDel("event:btnclick:btnclickEvent");
                        O.stop();
                        N.pushToEvents(O);
                        this.jCallEvent("tap", N)
                    }
                }
            }
        })(B);
        w.Event.Custom.dbltap = new w.Class(w.extend(w.Event.Custom, {
            type: "dbltap",
            timedout: false,
            tm: null,
            init: function(F, E) {
                this.x = E.x;
                this.y = E.y;
                this.timeStamp = E.timeStamp;
                this.button = 0;
                this.target = F;
                this.pushToEvents(E)
            }
        }));
        w.Event.Custom.dbltap.handler = {
            options: {
                threshold: 300
            },
            add: function(E) {
                this.jStore("event:dbltap:options", w.extend(w.detach(w.Event.Custom.dbltap.handler.options), E || {}));
                this.jAddEvent("tap", w.Event.Custom.dbltap.handler.handle, 1)
            },
            jRemove: function() {
                this.jRemoveEvent("tap", w.Event.Custom.dbltap.handler.handle)
            },
            handle: function(G) {
                var F, E;
                F = this.jFetch("event:dbltap:event");
                E = this.jFetch("event:dbltap:options");
                if (!F) {
                    F = new w.Event.Custom.dbltap(this, G);
                    F.tm = setTimeout(function() {
                        F.timedout = true;
                        G.isQueueStopped = w.$false;
                        this.jCallEvent("tap", G)
                    }.jBind(this), E.threshold + 10);
                    this.jStore("event:dbltap:event", F);
                    G.stopQueue()
                } else {
                    clearTimeout(F.tm);
                    this.jDel("event:dbltap:event");
                    if (!F.timedout) {
                        F.pushToEvents(G);
                        G.stopQueue().stop();
                        this.jCallEvent("dbltap", F)
                    } else {}
                }
            }
        };
        (function(J) {
            var I = J.$;

            function E(K) {
                return K.pointerType ? (("touch" === K.pointerType || K.MSPOINTER_TYPE_TOUCH === K.pointerType) && K.isPrimary) : 1 === K.changedTouches.length && (K.targetTouches.length ? K.targetTouches[0].identifier == K.changedTouches[0].identifier : true)
            }

            function G(K) {
                if (K.pointerType) {
                    return ("touch" === K.pointerType || K.MSPOINTER_TYPE_TOUCH === K.pointerType) ? K.pointerId : null
                } else {
                    return K.changedTouches[0].identifier
                }
            }

            function H(K) {
                if (K.pointerType) {
                    return ("touch" === K.pointerType || K.MSPOINTER_TYPE_TOUCH === K.pointerType) ? K : null
                } else {
                    return K.changedTouches[0]
                }
            }
            var F = 10;
            J.Event.Custom.touchdrag = new J.Class(J.extend(J.Event.Custom, {
                type: "touchdrag",
                state: "dragstart",
                id: null,
                dragged: false,
                init: function(M, L, K) {
                    var N = H(L);
                    this.id = N.pointerId || N.identifier;
                    this.clientX = N.clientX;
                    this.clientY = N.clientY;
                    this.pageX = N.pageX;
                    this.pageY = N.pageY;
                    this.x = N.pageX;
                    this.y = N.pageY;
                    this.timeStamp = L.timeStamp;
                    this.button = 0;
                    this.target = M;
                    this.pushToEvents(L);
                    this.state = K
                }
            }));
            J.Event.Custom.touchdrag.handler = {
                add: function() {
                    var L = J.Event.Custom.touchdrag.handler.onTouchMove.jBind(this),
                        K = J.Event.Custom.touchdrag.handler.onTouchEnd.jBind(this);
                    this.jAddEvent(["touchstart", window.navigator.pointerEnabled ? "pointerdown" : "MSPointerDown"], J.Event.Custom.touchdrag.handler.onTouchStart, 1);
                    this.jAddEvent(["touchend", window.navigator.pointerEnabled ? "pointerup" : "MSPointerUp"], J.Event.Custom.touchdrag.handler.onTouchEnd, 1);
                    this.jAddEvent(["touchmove", window.navigator.pointerEnabled ? "pointermove" : "MSPointerMove"], J.Event.Custom.touchdrag.handler.onTouchMove, 1);
                    this.jStore("event:touchdrag:listeners:document:move", L);
                    this.jStore("event:touchdrag:listeners:document:end", K);
                    I(document).jAddEvent(window.navigator.pointerEnabled ? "pointermove" : "MSPointerMove", L, 1);
                    I(document).jAddEvent(window.navigator.pointerEnabled ? "pointerup" : "MSPointerUp", K, 1)
                },
                jRemove: function() {
                    this.jRemoveEvent(["touchstart", window.navigator.pointerEnabled ? "pointerdown" : "MSPointerDown"], J.Event.Custom.touchdrag.handler.onTouchStart);
                    this.jRemoveEvent(["touchend", window.navigator.pointerEnabled ? "pointerup" : "MSPointerUp"], J.Event.Custom.touchdrag.handler.onTouchEnd);
                    this.jRemoveEvent(["touchmove", window.navigator.pointerEnabled ? "pointermove" : "MSPointerMove"], J.Event.Custom.touchdrag.handler.onTouchMove);
                    I(document).jRemoveEvent(window.navigator.pointerEnabled ? "pointermove" : "MSPointerMove", this.jFetch("event:touchdrag:listeners:document:move") || J.$F, 1);
                    I(document).jRemoveEvent(window.navigator.pointerEnabled ? "pointerup" : "MSPointerUp", this.jFetch("event:touchdrag:listeners:document:end") || J.$F, 1);
                    this.jDel("event:touchdrag:listeners:document:move");
                    this.jDel("event:touchdrag:listeners:document:end")
                },
                onTouchStart: function(L) {
                    var K;
                    if (!E(L)) {
                        return
                    }
                    K = new J.Event.Custom.touchdrag(this, L, "dragstart");
                    this.jStore("event:touchdrag:dragstart", K)
                },
                onTouchEnd: function(L) {
                    var K;
                    K = this.jFetch("event:touchdrag:dragstart");
                    if (!K || !K.dragged || K.id != G(L)) {
                        return
                    }
                    K = new J.Event.Custom.touchdrag(this, L, "dragend");
                    this.jDel("event:touchdrag:dragstart");
                    this.jCallEvent("touchdrag", K)
                },
                onTouchMove: function(L) {
                    var K;
                    K = this.jFetch("event:touchdrag:dragstart");
                    if (!K || !E(L)) {
                        return
                    }
                    if (K.id != G(L)) {
                        this.jDel("event:touchdrag:dragstart");
                        return
                    }
                    if (!K.dragged && Math.sqrt(Math.pow(H(L).pageX - K.x, 2) + Math.pow(H(L).pageY - K.y, 2)) > F) {
                        K.dragged = true;
                        this.jCallEvent("touchdrag", K)
                    }
                    if (!K.dragged) {
                        return
                    }
                    K = new J.Event.Custom.touchdrag(this, L, "dragmove");
                    this.jCallEvent("touchdrag", K)
                }
            }
        })(B);
        w.Event.Custom.touchpinch = new w.Class(w.extend(w.Event.Custom, {
            type: "touchpinch",
            scale: 1,
            previousScale: 1,
            curScale: 1,
            state: "pinchstart",
            init: function(F, E) {
                this.timeStamp = E.timeStamp;
                this.button = 0;
                this.target = F;
                this.x = E.touches[0].clientX + (E.touches[1].clientX - E.touches[0].clientX) / 2;
                this.y = E.touches[0].clientY + (E.touches[1].clientY - E.touches[0].clientY) / 2;
                this._initialDistance = Math.sqrt(Math.pow(E.touches[0].clientX - E.touches[1].clientX, 2) + Math.pow(E.touches[0].clientY - E.touches[1].clientY, 2));
                this.pushToEvents(E)
            },
            update: function(E) {
                var F;
                this.state = "pinchupdate";
                if (E.changedTouches[0].identifier != this.events[0].touches[0].identifier || E.changedTouches[1].identifier != this.events[0].touches[1].identifier) {
                    return
                }
                F = Math.sqrt(Math.pow(E.changedTouches[0].clientX - E.changedTouches[1].clientX, 2) + Math.pow(E.changedTouches[0].clientY - E.changedTouches[1].clientY, 2));
                this.previousScale = this.scale;
                this.scale = F / this._initialDistance;
                this.curScale = this.scale / this.previousScale;
                this.x = E.changedTouches[0].clientX + (E.changedTouches[1].clientX - E.changedTouches[0].clientX) / 2;
                this.y = E.changedTouches[0].clientY + (E.changedTouches[1].clientY - E.changedTouches[0].clientY) / 2;
                this.pushToEvents(E)
            }
        }));
        w.Event.Custom.touchpinch.handler = {
            add: function() {
                this.jAddEvent("touchstart", w.Event.Custom.touchpinch.handler.handleTouchStart, 1);
                this.jAddEvent("touchend", w.Event.Custom.touchpinch.handler.handleTouchEnd, 1);
                this.jAddEvent("touchmove", w.Event.Custom.touchpinch.handler.handleTouchMove, 1)
            },
            jRemove: function() {
                this.jRemoveEvent("touchstart", w.Event.Custom.touchpinch.handler.handleTouchStart);
                this.jRemoveEvent("touchend", w.Event.Custom.touchpinch.handler.handleTouchEnd);
                this.jRemoveEvent("touchmove", w.Event.Custom.touchpinch.handler.handleTouchMove)
            },
            handleTouchStart: function(F) {
                var E;
                if (F.touches.length != 2) {
                    return
                }
                F.stopDefaults();
                E = new w.Event.Custom.touchpinch(this, F);
                this.jStore("event:touchpinch:event", E)
            },
            handleTouchEnd: function(F) {
                var E;
                E = this.jFetch("event:touchpinch:event");
                if (!E) {
                    return
                }
                F.stopDefaults();
                this.jDel("event:touchpinch:event")
            },
            handleTouchMove: function(F) {
                var E;
                E = this.jFetch("event:touchpinch:event");
                if (!E) {
                    return
                }
                F.stopDefaults();
                E.update(F);
                this.jCallEvent("touchpinch", E)
            }
        };
        (function(J) {
            var H = J.$;
            J.Event.Custom.mousescroll = new J.Class(J.extend(J.Event.Custom, {
                type: "mousescroll",
                init: function(P, O, R, L, K, Q, M) {
                    var N = O.jGetPageXY();
                    this.x = N.x;
                    this.y = N.y;
                    this.timeStamp = O.timeStamp;
                    this.target = P;
                    this.delta = R || 0;
                    this.deltaX = L || 0;
                    this.deltaY = K || 0;
                    this.deltaZ = Q || 0;
                    this.deltaFactor = M || 0;
                    this.deltaMode = O.deltaMode || 0;
                    this.isMouse = false;
                    this.pushToEvents(O)
                }
            }));
            var I, F;

            function E() {
                I = null
            }

            function G(K, L) {
                return (K > 50) || (1 === L && !("win" == J.jBrowser.platform && K < 1)) || (0 === K % 12) || (0 == K % 4.000244140625)
            }
            J.Event.Custom.mousescroll.handler = {
                eventType: "onwheel" in document || J.jBrowser.ieMode > 8 ? "wheel" : "mousewheel",
                add: function() {
                    this.jAddEvent(J.Event.Custom.mousescroll.handler.eventType, J.Event.Custom.mousescroll.handler.handle, 1)
                },
                jRemove: function() {
                    this.jRemoveEvent(J.Event.Custom.mousescroll.handler.eventType, J.Event.Custom.mousescroll.handler.handle, 1)
                },
                handle: function(P) {
                    var Q = 0,
                        N = 0,
                        L = 0,
                        K = 0,
                        O, M;
                    if (P.detail) {
                        L = P.detail * -1
                    }
                    if (P.wheelDelta !== undefined) {
                        L = P.wheelDelta
                    }
                    if (P.wheelDeltaY !== undefined) {
                        L = P.wheelDeltaY
                    }
                    if (P.wheelDeltaX !== undefined) {
                        N = P.wheelDeltaX * -1
                    }
                    if (P.deltaY) {
                        L = -1 * P.deltaY
                    }
                    if (P.deltaX) {
                        N = P.deltaX
                    }
                    if (0 === L && 0 === N) {
                        return
                    }
                    Q = 0 === L ? N : L;
                    K = Math.max(Math.abs(L), Math.abs(N));
                    if (!I || K < I) {
                        I = K
                    }
                    O = Q > 0 ? "floor" : "ceil";
                    Q = Math[O](Q / I);
                    N = Math[O](N / I);
                    L = Math[O](L / I);
                    if (F) {
                        clearTimeout(F)
                    }
                    F = setTimeout(E, 200);
                    M = new J.Event.Custom.mousescroll(this, P, Q, N, L, 0, I);
                    M.isMouse = G(I, P.deltaMode || 0);
                    this.jCallEvent("mousescroll", M)
                }
            }
        })(B);
        B.extend(B, {
            getAbsoluteURL: (w.jBrowser.ieMode && w.jBrowser.ieMode < 8) ? (function(E) {
                if (/^http(s)?:\/\//.test(E)) {
                    return E
                }
                var F = document.createElement("div");
                F.innerHTML = '<a href="' + E + '">x</a>';
                return F.firstChild.href
            }) : (function(E) {
                if (/^http(s)?:\/\//.test(E)) {
                    return E
                }
                return w.$new("a", {
                    href: E
                }).href
            })
        });
        w.win = w.$(window);
        w.doc = w.$(document);
        return B
    })();
    (function(r) {
        if (!r) {
            throw "ImageJS not found";
            return
        }
        if (r.FX) {
            return
        }
        var q = r.$;
        r.FX = new r.Class({
            init: function(t, s) {
                this.el = r.$(t);
                this.options = r.extend(this.options, s);
                this.timer = false;
                if ("string" == r.jTypeOf(this.options.transition)) {
                    this.options.transition = r.FX.Transition[this.options.transition] || r.FX.Transition.sineIn
                }
                if ("string" == r.jTypeOf(this.options.cycles)) {
                    this.options.cycles = "infinite" === this.options.cycles ? Infinity : parseInt(this.options.cycles) || 1
                }
            },
            options: {
                fps: 60,
                duration: 500,
                transition: function(s) {
                    return -(Math.cos(Math.PI * s) - 1) / 2
                },
                cycles: 1,
                direction: "normal",
                onStart: r.$F,
                onComplete: r.$F,
                onBeforeRender: r.$F,
                onAfterRender: r.$F,
                forceAnimation: false,
                roundCss: true
            },
            styles: null,
            start: function(v) {
                var t = /\%$/,
                    u;
                this.styles = v;
                this.cycle = 0;
                this.state = 0;
                this.curFrame = 0;
                this.pStyles = {};
                this.alternate = "alternate" === this.options.direction || "alternate-reverse" === this.options.direction;
                this.continuous = "continuous" === this.options.direction || "continuous-reverse" === this.options.direction;
                for (u in this.styles) {
                    t.test(this.styles[u][0]) && (this.pStyles[u] = true);
                    if ("reverse" === this.options.direction || "alternate-reverse" === this.options.direction || "continuous-reverse" === this.options.direction) {
                        this.styles[u].reverse()
                    }
                }
                this.startTime = r.now();
                this.finishTime = this.startTime + this.options.duration;
                this.options.onStart.call();
                if (0 === this.options.duration) {
                    this.render(1);
                    this.options.onComplete.call()
                } else {
                    this.loopBind = this.loop.jBind(this);
                    if (!this.options.forceAnimation && r.jBrowser.features.requestAnimationFrame) {
                        this.timer = r.jBrowser.requestAnimationFrame.call(window, this.loopBind)
                    } else {
                        this.timer = this.loopBind.interval(Math.round(1000 / this.options.fps))
                    }
                }
                return this
            },
            stopAnimation: function() {
                if (this.timer) {
                    if (!this.options.forceAnimation && r.jBrowser.features.requestAnimationFrame && r.jBrowser.cancelAnimationFrame) {
                        r.jBrowser.cancelAnimationFrame.call(window, this.timer)
                    } else {
                        clearInterval(this.timer)
                    }
                    this.timer = false
                }
            },
            stop: function(s) {
                s = r.defined(s) ? s : false;
                this.stopAnimation();
                if (s) {
                    this.render(1);
                    this.options.onComplete.jDelay(10)
                }
                return this
            },
            calc: function(u, t, s) {
                u = parseFloat(u);
                t = parseFloat(t);
                return (t - u) * s + u
            },
            loop: function() {
                var u = r.now(),
                    t = (u - this.startTime) / this.options.duration,
                    v = Math.floor(t);
                if (u >= this.finishTime && v >= this.options.cycles) {
                    this.stopAnimation();
                    this.render(1);
                    this.options.onComplete.jDelay(10);
                    return this
                }
                if (this.alternate && this.cycle < v) {
                    for (var w in this.styles) {
                        this.styles[w].reverse()
                    }
                }
                this.cycle = v;
                if (!this.options.forceAnimation && r.jBrowser.features.requestAnimationFrame) {
                    this.timer = r.jBrowser.requestAnimationFrame.call(window, this.loopBind)
                }
                this.render((this.continuous ? v : 0) + this.options.transition(t % 1))
            },
            render: function(t) {
                var u = {};
                for (var v in this.styles) {
                    if ("opacity" === v) {
                        u[v] = Math.round(this.calc(this.styles[v][0], this.styles[v][1], t) * 100) / 100
                    } else {
                        u[v] = this.calc(this.styles[v][0], this.styles[v][1], t);
                        if (this.options.roundCss) {
                            u[v] = Math.round(u[v])
                        }
                        this.pStyles[v] && (u[v] += "%")
                    }
                }
                this.options.onBeforeRender(u, this.el);
                this.set(u);
                this.options.onAfterRender(u, this.el)
            },
            set: function(s) {
                return this.el.jSetCss(s)
            }
        });
        r.FX.Transition = {
            linear: function(s) {
                return s
            },
            sineIn: function(s) {
                return -(Math.cos(Math.PI * s) - 1) / 2
            },
            sineOut: function(s) {
                return 1 - r.FX.Transition.sineIn(1 - s)
            },
            expoIn: function(s) {
                return Math.pow(2, 8 * (s - 1))
            },
            expoOut: function(s) {
                return 1 - r.FX.Transition.expoIn(1 - s)
            },
            quadIn: function(s) {
                return Math.pow(s, 2)
            },
            quadOut: function(s) {
                return 1 - r.FX.Transition.quadIn(1 - s)
            },
            cubicIn: function(s) {
                return Math.pow(s, 3)
            },
            cubicOut: function(s) {
                return 1 - r.FX.Transition.cubicIn(1 - s)
            },
            backIn: function(t, s) {
                s = s || 1.618;
                return Math.pow(t, 2) * ((s + 1) * t - s)
            },
            backOut: function(t, s) {
                return 1 - r.FX.Transition.backIn(1 - t)
            },
            elasticIn: function(t, s) {
                s = s || [];
                return Math.pow(2, 10 * --t) * Math.cos(20 * t * Math.PI * (s[0] || 1) / 3)
            },
            elasticOut: function(t, s) {
                return 1 - r.FX.Transition.elasticIn(1 - t, s)
            },
            bounceIn: function(u) {
                for (var t = 0, s = 1; 1; t += s, s /= 2) {
                    if (u >= (7 - 4 * t) / 11) {
                        return s * s - Math.pow((11 - 6 * t - 11 * u) / 4, 2)
                    }
                }
            },
            bounceOut: function(s) {
                return 1 - r.FX.Transition.bounceIn(1 - s)
            },
            none: function(s) {
                return 0
            }
        }
    })(m);
    (function(r) {
        if (!r) {
            throw "ImageJS not found";
            return
        }
        if (!r.FX) {
            throw "ImageJS.FX not found";
            return
        }
        if (r.FX.Slide) {
            return
        }
        var q = r.$;
        r.FX.Slide = new r.Class(r.FX, {
            options: {
                mode: "vertical"
            },
            init: function(t, s) {
                this.el = r.$(t);
                this.options = r.extend(this.$parent.options, this.options);
                this.$parent.init(t, s);
                this.wrapper = this.el.jFetch("slide:wrapper");
                this.wrapper = this.wrapper || r.$new("DIV").jSetCss(r.extend(this.el.jGetStyles("margin-top", "margin-left", "margin-right", "margin-bottom", "position", "top", "float"), {
                    overflow: "hidden"
                })).enclose(this.el);
                this.el.jStore("slide:wrapper", this.wrapper).jSetCss({
                    margin: 0
                })
            },
            vertical: function() {
                this.margin = "margin-top";
                this.layout = "height";
                this.offset = this.el.offsetHeight
            },
            horizontal: function(s) {
                this.margin = "margin-" + (s || "left");
                this.layout = "width";
                this.offset = this.el.offsetWidth
            },
            right: function() {
                this.horizontal()
            },
            left: function() {
                this.horizontal("right")
            },
            start: function(u, x) {
                this[x || this.options.mode]();
                var w = this.el.jGetCss(this.margin).jToInt(),
                    v = this.wrapper.jGetCss(this.layout).jToInt(),
                    s = {},
                    y = {},
                    t;
                s[this.margin] = [w, 0], s[this.layout] = [0, this.offset], y[this.margin] = [w, -this.offset], y[this.layout] = [v, 0];
                switch (u) {
                    case "in":
                        t = s;
                        break;
                    case "out":
                        t = y;
                        break;
                    case "toggle":
                        t = (0 == v) ? s : y;
                        break
                }
                this.$parent.start(t);
                return this
            },
            set: function(s) {
                this.el.jSetCssProp(this.margin, s[this.margin]);
                this.wrapper.jSetCssProp(this.layout, s[this.layout]);
                return this
            },
            slideIn: function(s) {
                return this.start("in", s)
            },
            slideOut: function(s) {
                return this.start("out", s)
            },
            hide: function(t) {
                this[t || this.options.mode]();
                var s = {};
                s[this.layout] = 0, s[this.margin] = -this.offset;
                return this.set(s)
            },
            show: function(t) {
                this[t || this.options.mode]();
                var s = {};
                s[this.layout] = this.offset, s[this.margin] = 0;
                return this.set(s)
            },
            toggle: function(s) {
                return this.start("toggle", s)
            }
        })
    })(m);
    (function(r) {
        if (!r) {
            throw "ImageJS not found";
            return
        }
        if (r.PFX) {
            return
        }
        var q = r.$;
        r.PFX = new r.Class(r.FX, {
            init: function(s, t) {
                this.el_arr = s;
                this.options = r.extend(this.options, t);
                this.timer = false
            },
            start: function(x) {
                var t = /\%$/,
                    w, v, u = x.length;
                this.styles_arr = x;
                this.pStyles_arr = new Array(u);
                for (v = 0; v < u; v++) {
                    this.pStyles_arr[v] = {};
                    for (w in x[v]) {
                        t.test(x[v][w][0]) && (this.pStyles_arr[v][w] = true)
                    }
                }
                this.$parent.start([]);
                return this
            },
            render: function(s) {
                for (var t = 0; t < this.el_arr.length; t++) {
                    this.el = r.$(this.el_arr[t]);
                    this.styles = this.styles_arr[t];
                    this.pStyles = this.pStyles_arr[t];
                    this.$parent.render(s)
                }
            }
        })
    })(m);
    (function(s) {
        if (!s) {
            throw "ImageJS not found"
        }
        var r = s.$;
        var q = window.URL || window.webkitURL || null;
        m.ImageLoader = new s.Class({
            img: null,
            ready: false,
            options: {
                onprogress: s.$F,
                onload: s.$F,
                onabort: s.$F,
                onerror: s.$F,
                oncomplete: s.$F,
                onxhrerror: s.$F,
                xhr: false,
                progressiveLoad: true
            },
            size: null,
            _timer: null,
            loadedBytes: 0,
            _handlers: {
                onprogress: function(t) {
                    if (t.target && (200 === t.target.status || 304 === t.target.status) && t.lengthComputable) {
                        this.options.onprogress.jBind(null, (t.loaded - (this.options.progressiveLoad ? this.loadedBytes : 0)) / t.total).jDelay(1);
                        this.loadedBytes = t.loaded
                    }
                },
                onload: function(t) {
                    if (t) {
                        r(t).stop()
                    }
                    this._unbind();
                    if (this.ready) {
                        return
                    }
                    this.ready = true;
                    this._cleanup();
                    !this.options.xhr && this.options.onprogress.jBind(null, 1).jDelay(1);
                    this.options.onload.jBind(null, this).jDelay(1);
                    this.options.oncomplete.jBind(null, this).jDelay(1)
                },
                onabort: function(t) {
                    if (t) {
                        r(t).stop()
                    }
                    this._unbind();
                    this.ready = false;
                    this._cleanup();
                    this.options.onabort.jBind(null, this).jDelay(1);
                    this.options.oncomplete.jBind(null, this).jDelay(1)
                },
                onerror: function(t) {
                    if (t) {
                        r(t).stop()
                    }
                    this._unbind();
                    this.ready = false;
                    this._cleanup();
                    this.options.onerror.jBind(null, this).jDelay(1);
                    this.options.oncomplete.jBind(null, this).jDelay(1)
                }
            },
            _bind: function() {
                r(["load", "abort", "error"]).jEach(function(t) {
                    this.img.jAddEvent(t, this._handlers["on" + t].jBindAsEvent(this).jDefer(1))
                }, this)
            },
            _unbind: function() {
                if (this._timer) {
                    try {
                        clearTimeout(this._timer)
                    } catch (t) {}
                    this._timer = null
                }
                r(["load", "abort", "error"]).jEach(function(u) {
                    this.img.jRemoveEvent(u)
                }, this)
            },
            _cleanup: function() {
                this.jGetSize();
                if (this.img.jFetch("new")) {
                    var t = this.img.parentNode;
                    this.img.jRemove().jDel("new").jSetCss({
                        position: "static",
                        top: "auto"
                    });
                    t.kill()
                }
            },
            loadBlob: function(u) {
                var v = new XMLHttpRequest(),
                    t;
                r(["abort", "progress"]).jEach(function(w) {
                    v["on" + w] = r(function(x) {
                        this._handlers["on" + w].call(this, x)
                    }).jBind(this)
                }, this);
                v.onerror = r(function() {
                    this.options.onxhrerror.jBind(null, this).jDelay(1);
                    this.options.xhr = false;
                    this._bind();
                    this.img.src = u
                }).jBind(this);
                v.onload = r(function() {
                    if (200 !== v.status && 304 !== v.status) {
                        this._handlers.onerror.call(this);
                        return
                    }
                    t = v.response;
                    this._bind();
                    if (q && !s.jBrowser.trident && !("ios" === s.jBrowser.platform && s.jBrowser.version < 537)) {
                        this.img.setAttribute("src", q.createObjectURL(t))
                    } else {
                        this.img.src = u
                    }
                }).jBind(this);
                v.open("GET", u);
                v.responseType = "blob";
                v.send()
            },
            init: function(u, t) {
                this.options = s.extend(this.options, t);
                this.img = r(u) || s.$new("img", {}, {
                    "max-width": "none",
                    "max-height": "none"
                }).jAppendTo(s.$new("div").jAddClass("image-temporary-img").jSetCss({
                    position: "absolute",
                    top: -10000,
                    width: 10,
                    height: 10,
                    overflow: "hidden"
                }).jAppendTo(s.body)).jStore("new", true);
                if (s.jBrowser.features.xhr2 && this.options.xhr && "string" == s.jTypeOf(u)) {
                    this.loadBlob(u);
                    return
                }
                var v = function() {
                    if (this.isReady()) {
                        this._handlers.onload.call(this)
                    } else {
                        this._handlers.onerror.call(this)
                    }
                    v = null
                }.jBind(this);
                this._bind();
                if ("string" == s.jTypeOf(u)) {
                    this.img.src = u
                } else {
                    if (s.jBrowser.trident && 5 == s.jBrowser.version && s.jBrowser.ieMode < 9) {
                        this.img.onreadystatechange = function() {
                            if (/loaded|complete/.test(this.img.readyState)) {
                                this.img.onreadystatechange = null;
                                v && v()
                            }
                        }.jBind(this)
                    }
                    this.img.src = u.getAttribute("src")
                }
                this.img && this.img.complete && v && (this._timer = v.jDelay(100))
            },
            destroy: function() {
                this._unbind();
                this._cleanup();
                this.ready = false;
                return this
            },
            isReady: function() {
                var t = this.img;
                return (t.naturalWidth) ? (t.naturalWidth > 0) : (t.readyState) ? ("complete" == t.readyState) : t.width > 0
            },
            jGetSize: function() {
                return this.size || (this.size = {
                    width: this.img.naturalWidth || this.img.width,
                    height: this.img.naturalHeight || this.img.height
                })
            }
        })
    })(m);
    (function(r) {
        if (!r) {
            throw "ImageJS not found";
            return
        }
        if (r.Tooltip) {
            return
        }
        var q = r.$;
        r.Tooltip = function(u, v) {
            var s = this.tooltip = r.$new("div", null, {
                position: "absolute",
                "z-index": 999
            }).jAddClass("CodilarTooltip");
            r.$(u).jAddEvent("mouseover", function() {
                s.jAppendTo(document.body)
            });
            r.$(u).jAddEvent("mouseout", function() {
                s.jRemove()
            });
            r.$(u).jAddEvent("mousemove", function(z) {
                var B = 20,
                    y = r.$(z).jGetPageXY(),
                    x = s.jGetSize(),
                    w = r.$(window).jGetSize(),
                    A = r.$(window).jGetScroll();

                function t(E, C, D) {
                    return (D < (E - C) / 2) ? D : ((D > (E + C) / 2) ? (D - C) : (E - C) / 2)
                }
                s.jSetCss({
                    left: A.x + t(w.width, x.width + 2 * B, y.x - A.x) + B,
                    top: A.y + t(w.height, x.height + 2 * B, y.y - A.y) + B
                })
            });
            this.text(v)
        };
        r.Tooltip.prototype.text = function(s) {
            this.tooltip.firstChild && this.tooltip.removeChild(this.tooltip.firstChild);
            this.tooltip.append(document.createTextNode(s))
        }
    })(m);
    (function(r) {
        if (!r) {
            throw "ImageJS not found";
            return
        }
        if (r.MessageBox) {
            return
        }
        var q = r.$;
        r.Message = function(v, u, t, s) {
            this.hideTimer = null;
            this.messageBox = r.$new("span", null, {
                position: "absolute",
                "z-index": 999,
                visibility: "hidden",
                opacity: 0.8
            }).jAddClass(s || "").jAppendTo(t || r.body);
            this.setMessage(v);
            this.show(u)
        };
        r.Message.prototype.show = function(s) {
            this.messageBox.show();
            this.hideTimer = this.hide.jBind(this).jDelay(r.ifndef(s, 5000))
        };
        r.Message.prototype.hide = function(s) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
            if (this.messageBox && !this.hideFX) {
                this.hideFX = new m.FX(this.messageBox, {
                    duration: r.ifndef(s, 500),
                    onComplete: function() {
                        this.messageBox.kill();
                        delete this.messageBox;
                        this.hideFX = null
                    }.jBind(this)
                }).start({
                    opacity: [this.messageBox.jGetCss("opacity"), 0]
                })
            }
        };
        r.Message.prototype.setMessage = function(s) {
            this.messageBox.firstChild && this.tooltip.removeChild(this.messageBox.firstChild);
            this.messageBox.append(document.createTextNode(s))
        }
    })(m);
    m.Options = (function(r) {
        if (!r) {
            throw "ImageJS not found";
            return
        }
        var q = r.$;
        var s = function(t) {
            this.defaults = t;
            this.options = {}
        };
        s.prototype.get = function(t) {
            return r.defined(this.options[t]) ? this.options[t] : this.defaults[t]
        };
        s.prototype.set = function(u, t) {
            u = u.jTrim();
            if (!u) {
                return
            }
            r.jTypeOf(t) === "string" && (t = t.jTrim());
            if (t === "true") {
                t = true
            }
            if (t === "false") {
                t = false
            }
            if (parseInt(t) == t) {
                t = parseInt(t)
            }
            this.options[u] = t
        };
        s.prototype.fromRel = function(t) {
            var u = this;
            q(t.split(";")).jEach(function(v) {
                v = v.split(":");
                u.set(v.shift(), v.join(":"))
            })
        };
        s.prototype.fromJSON = function(u) {
            for (var t in u) {
                if (u.hasOwnProperty(t)) {
                    this.set(t, u[t])
                }
            }
        };
        s.prototype.exists = function(t) {
            return r.defined(this.options[t]) ? true : false
        };
        return s
    }(m));
    var k = {
        rows: 1,
        columns: 36,
        speed: 50,
        "start-row": "auto",
        "start-column": "auto",
        "reverse-row": false,
        "reverse-column": false,
        "row-increment": 1,
        "column-increment": 1,
        "loop-row": false,
        "loop-column": true,
        autospin: "once",
        "autospin-start": "load",
        "autospin-stop": "click",
        "autospin-speed": 3600,
        "autospin-direction": "clockwise",
        spin: "drag",
        smoothing: true,
        magnify: true,
        "magnifier-width": "80%",
        "magnifier-shape": "inner",
        fullscreen: true,
        hint: true,
        "initialize-on": "load",
        "mousewheel-step": 3,
        "right-click": false,
        onready: f.$F,
        onstart: f.$F,
        onstop: f.$F,
        onzoomin: f.$F,
        onzoomout: f.$F,
        onspin: f.$F
    };
    k = f.extend(k, {
        filename: "auto",
        filepath: "auto",
        "large-filename": "auto",
        "large-filepath": "auto",
        "row-digits": 2,
        "column-digits": 2,
        images: "",
        "large-images": ""
    });
    var i = f.$;
    var p = "";
    var g = {
        mousedown: window.navigator.pointerEnabled ? "pointerdown" : window.navigator.msPointerEnabled ? "MSPointerDown" : "mousedown",
        mouseup: window.navigator.pointerEnabled ? "pointerup" : window.navigator.msPointerEnabled ? "MSPointerUp" : "mouseup",
        mousemove: window.navigator.pointerEnabled ? "pointermove" : window.navigator.msPointerEnabled ? "MSPointerMove" : "mousemove",
        mouseover: window.navigator.pointerEnabled ? "pointerover" : window.navigator.msPointerEnabled ? "MSPointerOver" : "mouseover",
        mouseout: window.navigator.pointerEnabled ? "pointerout" : window.navigator.msPointerEnabled ? "MSPointerOut" : "mouseout"
    };
    var h = function(q) {
        return q.replace(/[!'()\s]/g, escape).replace(/\*/g, "%2A")
    };
    var o = function(r, t) {
        var s = f.$new(r),
            q = t.split(",");
        i(q).jEach(function(u) {
            s.jAddClass(u.jTrim())
        });
        s.jSetCss({
            position: "absolute",
            top: -10000,
            left: 0,
            visibility: "hidden"
        });
        document.body.appendChild(s);
        i(function() {
            this.jRemove()
        }).jBind(s).jDelay(100)
    };
    var b = "ios" === f.jBrowser.platform && /CriOS\//.test(navigator.userAgent);
    var c = (function() {
        var q = navigator.userAgent.match(/windows nt ([0-9]{1,}[\.0-9]{0,})/i);
        return (q ? parseFloat(q[1]) : -1)
    })();
    var e = true;
    var d = false;
    var l = 150;
    var n = function(t, s) {
        this.o = i(t);
        while (t.firstChild && t.firstChild.tagName !== "IMG") {
            t.removeChild(t.firstChild)
        }
        if (t.firstChild.tagName !== "IMG") {
            throw "Error loading Image 360. Cannot find image."
        }
        if (f.jBrowser.ieMode) {
            this.o.jAddClass("image-for-ie" + f.jBrowser.ieMode)
        }
        this.oi = t.replaceChild(t.firstChild.cloneNode(false), t.firstChild);
        this._o = new f.Options(k);
        this.op = i(this._o.get).jBind(this._o);
        this._o.fromJSON(f.extend(window.Image360Options || {}, Image360.options));
        this._o.fromRel(t.getAttribute("data-image360-options") || t.rel);
        this.lang = new f.Options({
            "loading-text": "Loading...",
                        "hint-text": "Drag to spin",
            "mobile-hint-text": "Swipe to spin"
        });
        this.lang.fromJSON(f.extend(window.Image360Lang || {}, Image360.lang));
        this.localString = i(this.lang.get).jBind(this.lang);
        this.currentFrame = {
            row: 0,
            col: 0
        };
        this.concurrentImages = 6;
        this.images = {
            small: i([]),
            fullscreen: i([])
        };
        this.imageQueue = {
            small: i([]),
            fullscreen: i([]),
            zoom: i([])
        };
        this.imageMap = {};
        this.loadedRows = {
            count: 0,
            indexes: i([])
        };
        this.pendingImages = {
            small: 0,
            fullscreen: 0,
            zoom: 0
        };
        this.bgImages = {
            url: i([]),
            position: i([])
        };
        this.bgURL = null;
        this.lastBgSize = {
            width: 0,
            height: 0
        };
        this.useMultiBackground = e && f.jBrowser.features.multibackground;
        this.useXHR = d && f.jBrowser.features.xhr2;
        this.canMagnify = true;
        this.imageLoadStarted = {
            small: 0,
            fullscreen: 0,
            zoom: 0
        };
        this.isFullScreen = false;
        this.fullScreenSize = {
            width: 0,
            height: 0
        };
        this.fullScreenBox = null;
        this.fullscreenIcon = null;
        this.fullScreenImage = null;
        this.fullScreenFX = null;
        this.fullScreenExitFX = null;
        this.firstFullScreenRun = true;
        this.resizeCallback = null;
        this.boundaries = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        };
        this.normalSize = {
            width: 0,
            height: 0
        };
        this.size = {
            width: 0,
            height: 0
        };
        this.spinStarted = false;
        this.isVerticalSpin = false;
        this.borders = 0;
        this.boxSize = {
            width: 0,
            height: 0
        };
        this.boxBoundaries = {
            width: 0,
            height: 0
        };
        this.imgCacheBox = f.$new("div").jAddClass("image-temporary-img").jSetCss({
            position: "absolute",
            top: -1000,
            width: 10,
            height: 10,
            overflow: "hidden"
        }).jAppendTo(f.body);
        this.addedCSS = [];
        this.ppf = {
            x: 60,
            y: 60
        };
        var r = this;
        this.sis = i(i(this.op("images").jTrim().split(" ")).filter(function(u) {
            return "" !== u
        }));
        this.bis = i(i(this.op("large-images").jTrim().split(" ")).filter(function(u) {
            return "" !== u
        }));
        if (isNaN(parseInt(this.op("row-increment")))) {
            this._o.set("row-increment", this._o.defaults["row-increment"])
        }
        if (isNaN(parseInt(this.op("column-increment")))) {
            this._o.set("column-increment", this._o.defaults["column-increment"])
        }
        this._o.set("columns", Math.floor(this.op("columns") / this.op("column-increment")));
        this._o.set("rows", Math.floor(this.op("rows") / this.op("row-increment")));
        if (isNaN(parseInt(this.op("speed")))) {
            this._o.set("speed", this._o.defaults.speed)
        }
        this._o.set("autospin-start", this.op("autospin-start").split(","));
        (f.jBrowser.touchScreen && "hover" === this.op("autospin-stop")) && this._o.set("autospin-stop", "click");
        if (!this._o.exists("autospin-speed") || !isFinite(this.op("autospin-speed"))) {
            this._o.set("autospin-speed", Math.min(l * parseInt(this.op("columns"), 10), this._o.defaults["autospin-speed"]))
        }
        isNaN(parseInt(this.op("mousewheel-step"), 10)) && this._o.set("mousewheel-step", 3);
        ("infinite" === this.op("autospin") && "hover" === this.op("autospin-stop")) && this._o.set("hint", false);
        !this._o.exists("hint") && ("infinite" === this.op("autospin") && "click" === this.op("autospin-stop") && i(this.op("autospin-start")).contains("click")) && this._o.set("hint", false);
        ("string" == f.jTypeOf(this.op("onready"))) && ("function" == f.jTypeOf(window[this.op("onready")])) && this._o.set("onready", window[this.op("onready")]);
        ("string" == f.jTypeOf(this.op("onspin"))) && ("function" === f.jTypeOf(window[this.op("onspin")])) && this._o.set("onspin", window[this.op("onspin")]);
        ("string" == f.jTypeOf(this.op("onzoomin"))) && ("function" === f.jTypeOf(window[this.op("onzoomin")])) && this._o.set("onzoomin", window[this.op("onzoomin")]);
        ("string" == f.jTypeOf(this.op("onzoomout"))) && ("function" === f.jTypeOf(window[this.op("onzoomout")])) && this._o.set("onzoomout", window[this.op("onzoomout")]);
        ("function" !== f.jTypeOf(this.op("onspin"))) && this.op.set("onspin", f.F);
        ("function" !== f.jTypeOf(this.op("onzoomin"))) && this.op.set("onzoomin", f.F);
        ("function" !== f.jTypeOf(this.op("onzoomout"))) && this.op.set("onzoomout", f.F);
        this.o.jAddEvent("click", function(u) {
            u.stop()
        }).jAddEvent("dragstart", function(u) {
            u.stop()
        }).jAddEvent("selectstart", function(u) {
            u.stop()
        }).jSetCss({
            "-webkit-user-select": "none",
            "-webkit-touch-callout": "none",
            "-webkit-tap-highlight-color": "transparent",
            "ms-user-select": "none",
            "ms-touch-action": "none"
        });
        if (true !== this.op("right-click")) {
            this.o.jAddEvent("contextmenu", function(u) {
                u.stop();
                return false
            })
        }
        if (this.op("hint")) {
            o("span", "Image360-hint-side")
        }
        o("div", "Image360-progress-bar-state");
        o("div", "Image360-wait");
        if (this.op("fullscreen")) {
            o("div", "Image360-button,fullscreen")
        }(function q() {
            var u;
            if (!t.firstChild.getAttribute("src")) {
                q.jBind(this).jDelay(100);
                return
            }
            if (!this.sis.length) {
                u = this.prepareFilename(t.firstChild.getAttribute("src"), this.op("filepath"), this.op("filename"), true);
                this._o.set("filepath", u.path);
                this._o.set("filename", u.tpl);
                u = this.prepareFilename(t.getAttribute("href") || "", this.op("large-filepath"), this.op("large-filename"));
                this._o.set("large-filepath", u.path);
                this._o.set("large-filename", u.tpl);
                if ("auto" == this.op("large-filename")) {
                    this._o.set("fullscreen", false);
                    this._o.set("magnify", false)
                }
            }!parseInt(this.op("start-row"), 10) && this._o.set("start-row", 1);
            !parseInt(this.op("start-column"), 10) && this._o.set("start-column", 1);
            parseInt(this.op("start-row"), 10) > parseInt(this.op("rows"), 10) && this._o.set("start-row", this.op("rows"));
            parseInt(this.op("start-column"), 10) > parseInt(this.op("columns"), 10) && this._o.set("start-column", this.op("columns"));
            if (true === this.op("reverse-row")) {
                this._o.set("start-row", this.op("rows") + 1 - this.op("start-row"))
            }
            if (true === this.op("reverse-column")) {
                this._o.set("start-column", this.op("columns") + 1 - this.op("start-column"))
            }
            new f.ImageLoader(t.firstChild, {
                onload: i(function(x) {
                    var w, z = false,
                        y = i(function() {
                            if (!z) {
                                z = true;
                                i(this.preInit).call(this)
                            }
                        }).jBind(this),
                        v = i(function() {
                            this.normalSize = w.jGetSize();
                            w.parentNode.jRemove();
                            if (this.normalSize.width < 50) {
                                this.normalSize = x.jGetSize()
                            }
                            if (i(this.o).jGetSize().width < 50) {
                                this.o.jSetCssProp("max-width", "none")
                            }
                            switch (this.op("initialize-on")) {
                                case "hover":
                                    this.o.jAddEvent("mouseover", y);
                                    break;
                                case "click":
                                    this.o.jAddEvent("click", y);
                                    break;
                                default:
                                    y()
                            }
                        }).jBind(this);
                    w = i(x.img.cloneNode(false)).jAppendTo(f.$new("div").jAddClass("image-temporary-img").jSetCss({
                        position: "absolute",
                        top: -10000,
                        width: 10,
                        height: 10,
                        overflow: "hidden"
                    }).jAppendTo(f.body));
                    v.jDelay(1)
                }).jBind(this)
            })
        }).call(this)
    };
    n.prototype.prepareFilename = function(q, B, w, t) {
        var x = {
                path: B,
                tpl: w.replace(/(\/|\\)/ig, "")
            },
            s, r, y = 0,
            z = 0,
            v = 0,
            A = "1",
            u = "1";
        if (!q) {
            return x
        }
        q = q.split("/");
        w = q.pop().split(".");
        B = (q.join("/") + "/").replace(/^\/$/, "");
        s = w.length > 1 ? "." + w.pop() : "";
        w = w.join(".");
        t || (t = false);
        x.path = "auto" == x.path ? B : x.path.replace(/\/$/, "") + "/";
        if ("auto" == x.tpl) {
            x.tpl = w.replace(/(\d?\d{1,})\-?(\d?\d{1,})?$/, function(F, D, C) {
                var E;
                if (undefined !== C && null !== C && "" !== C) {
                    A = D;
                    u = C;
                    E = "{row}-{col}"
                } else {
                    u = D;
                    E = "{col}"
                }
                return E
            }) + s
        } else {
            if (r = new RegExp(x.tpl.replace(/(\$|\?)/g, "\\$1").replace(/({row}|{col})/g, i(function(D, C) {
                if ("{row}" === C) {
                    z = ++y
                }
                if ("{col}" === C) {
                    v = ++y
                }
                return "(0{0,}[1-9]{1," + ("{row}" === C && this._o.exists("row-digits") ? this.op("row-digits") : "{col}" === C && this._o.exists("column-digits") ? this.op("column-digits") : "") + "})"
            }).jBind(this))).exec(w + s)) {
                if (z) {
                    A = r[z]
                }
                if (v) {
                    u = r[v]
                }
            } else {
                if (r = new RegExp(x.tpl.replace(/(\$|\?)/g, "\\$1").replace(/({row}|{col})/g, i(function(D, C) {
                    return "(\\d{1," + ("{row}" === C && this._o.exists("row-digits") ? this.op("row-digits") : "{col}" === C && this._o.exists("column-digits") ? this.op("column-digits") : "") + "})"
                }).jBind(this))).exec(w + s)) {
                    if (z) {
                        A = r[z]
                    }
                    if (v) {
                        u = r[v]
                    }
                }
            }
        }
        if (t) {
            if (!this._o.exists("row-digits")) {
                this._o.set("row-digits", A.length)
            }
            if (!this._o.exists("column-digits")) {
                this._o.set("column-digits", u.length)
            }
        }
        if ("auto" == this.op("start-row")) {
            this._o.set("start-row", A.jToInt())
        }
        if ("auto" == this.op("start-column")) {
            this._o.set("start-column", u.jToInt())
        }
        return x
    };
    n.prototype.prepareUrl = function(t, q, s) {
        function r(u, v) {
            return Array(v - ("" + u).length + 1).join("0") + u
        }
        s = s === true ? "large-" : "";
        if (this.sis.length) {
            if (s && !this.bis.length) {
                return ""
            }
            return this[(s) ? "bis" : "sis"][(t - 1) * this.op("columns") + q - 1]
        }
        t = r(1 + (t - 1) * this.op("row-increment"), this.op("row-digits"));
        q = r(1 + (q - 1) * this.op("column-increment"), this.op("column-digits"));
        return h(this.op(s + "filepath") + this.op(s + "filename").split("{row}").join(t).split("{col}").join(q))
    };
    n.prototype.getImageURL = function(u, t, s) {
        var q = null,
            r = "";
        s || (s = "small");
        q = this.getImageInfo(u, t, s);
        q && (r = q.url);
        return r
    };
    n.prototype.getImageInfo = function(t, s, r) {
        var q = {};
        r || (r = "small");
        (true === this.op("reverse-row")) && (t = this.op("rows") + 1 - t);
        (true === this.op("reverse-column")) && (s = this.op("columns") + 1 - s);
        q[r] = {
            url: this.prepareUrl(t, s, "fullscreen" === r || "zoom" === r),
            left: 0,
            top: 0
        };
        return q[r] || null
    };
    n.prototype.onImageLoadProgress = function(s, r, q) {
        if (i(this.imageMap[r]).filter(function(t) {
            return ("small" !== s || this.isVerticalSpin || t.row === this.op("start-row") - 1)
        }, this).length) {
            this.progressBar.increment(q * this.progressBar.step)
        }
    };
    n.prototype.onImageLoaded = function(t, s, w) {
        var v = i([]),
            q, r = 1,
            u = function(y, x) {
                return y - x
            };
        this.pendingImages[t]--;
        if (w.ready) {
            if (this.useMultiBackground) {
                r = this.bgImages.url.push("url('" + w.img.getAttribute("src") + "')");
                this.bgImages.position.push("0px -10000px");
                if (!b || "fullscreen" !== t) {
                    this.bgURL = this.bgImages.url.join(",")
                }
            }
            if (!this.useMultiBackground && !this.imageMap[s].URLCached) {
                this.imgCacheBox.append(w.img);
                this.imageMap[s].URLCached = true
            }
            i(i(this.imageMap[s]).filter(function(x) {
                return x.type === t
            })).jEach(function(z, y, x) {
                z.img.framesOnImage = x.length;
                z.img.bgIndex = r - 1;
                z.img.bgURL = "url('" + w.img.getAttribute("src") + "')";
                z.img.loaded = true;
                v.contains(z.row) || v.push(z.row)
            });
            if ("small" == t) {
                i(v).jEach(function(x) {
                    if (!i(this.images[t][x]).filter(function(y) {
                        return y.loaded !== true
                    }).length) {
                        this.loadedRows.count++;
                        this.loadedRows.indexes.push(x);
                        this.loadedRows.indexes.sort(u);
                        this.C && this.checkJumpRowCol(this.currentFrame.row, this.currentFrame.col);
                        if (b || this.isVerticalSpin ? (!this.imageQueue[t].length && 0 === this.pendingImages[t]) : x === this.op("start-row") - 1) {
                            setTimeout(function() {
                                this.progressBar.hide();
                                this.init()
                            }.jBind(this), 1)
                        }
                    }
                }, this)
            }
            if (!b && this.isFullScreen && "fullscreen" == t) {
                this.jump_(this.currentFrame.row, this.currentFrame.col)
            }
        }
        if (!this.imageQueue[t].length) {
            if (b && this.isFullScreen && "fullscreen" == t && 0 === this.pendingImages[t]) {
                this.bgURL = this.bgImages.url.join(",");
                this.jump_(this.currentFrame.row, this.currentFrame.col)
            }
            return
        }
        if (this.pendingImages[t] < this.concurrentImages && this.imageQueue[t].length) {
            this.pendingImages[t]++;
            s = this.imageQueue[t].shift();
            new f.ImageLoader(s, {
                xhr: this.useXHR,
                oncomplete: this.onImageLoaded.jBind(this, t, s),
                onprogress: this.onImageLoadProgress.jBind(this, t, s)
            })
        }
    };
    n.prototype.preloadImages = function(t, A, r) {
        t || (t = "small");
        var v = this.op("columns"),
            B = this.op("rows"),
            s = 0,
            w, u, z, q;
        u = A;
        w = r;
        this.images[t] = new Array(B);
        do {
            this.images[t][u - 1] = new Array(v);
            do {
                z = this.getImageInfo(u, w, t);
                if (!this.imageQueue[t].contains(z.url)) {
                    ("small" == t && (u == A || this.isVerticalSpin)) && s++;
                    this.imageQueue[t].push(z.url)
                }
                z.left *= -1;
                z.top *= -1;
                z.bgIndex = 0;
                z.framesOnImage = 1;
                z.loaded = false;
                this.images[t][u - 1][w - 1] = z;
                this.imageMap[z.url] || (this.imageMap[z.url] = i([]));
                this.imageMap[z.url].push({
                    row: u - 1,
                    type: t,
                    img: this.images[t][u - 1][w - 1]
                });
                --w < 1 && (w = v)
            } while (w != r);
            --u < 1 && (u = B)
        } while (u != A);
        if (this.imageQueue[t].length === B * v) {
            this.useXHR = false
        }
        this.progressBar.step = 100 / ("small" == t ? s : this.imageQueue[t].length);
        this.progressBar.show(t === "small" ? "center" : "auto", (this.useXHR || 100 !== this.progressBar.step) ? true : false);
        this.imageLoadStarted[t] = f.now();
        while (this.pendingImages[t] < this.concurrentImages && this.imageQueue[t].length) {
            q = this.imageQueue[t].shift();
            new f.ImageLoader(q, {
                xhr: this.useXHR,
                oncomplete: this.onImageLoaded.jBind(this, t, q),
                onprogress: this.onImageLoadProgress.jBind(this, t, q),
                onxhrerror: i(function() {
                    if (100 === this.progressBar.step) {
                        this.progressBar.setIncrementalStyle(false)
                    }
                }).jBind(this)
            });
            this.pendingImages[t]++
        }
    };
    n.prototype.preInit = function(r) {
        var s = "m360-box-" + Math.floor(Math.random() * f.now()),
            q = null;
        if (!r && (this.op("fullscreen") || this.op("magnify"))) {
            new f.ImageLoader(this.prepareUrl(1, 1, true), {
                onload: i(function(t) {
                    this.zoomSize = this.fullScreenSize = t.jGetSize()
                }).jBind(this),
                onerror: i(function(t) {
                    this._o.set("fullscreen", false);
                    this._o.set("magnify", false)
                }).jBind(this),
                oncomplete: i(function(t) {
                    this.preInit(true)
                }).jBind(this)
            });
            return
        }
        this.isVerticalSpin = (1 === this.op("columns") && this.op("rows") > 1);
        this.size = i(this.o.firstChild).jGetSize();
        if (0 === this.size.height) {
            this.preInit.jBind(this).jDelay(500);
            return
        }
        q = f.addCSS("#" + s + ":after", {
            "padding-bottom": (this.normalSize.height / this.normalSize.width) * 100 + "% !important"
        }, "image360-css");
        if (q > -1) {
            this.addedCSS.push(q)
        }
        this.wrapper = f.$new("div", {
            id: s
        }).jAddClass("Image360-box").jAddClass(f.jBrowser.ieMode ? ("image-for-ie" + f.jBrowser.ieMode) : "").jSetCss({
            display: "inline-block",
            overflow: "hidden",
            position: "relative",
            "text-align": "center",
            width: "100%",
            "max-width": this.normalSize.width
        }).enclose(this.o.jSetCss({
            display: "inline-block",
            visibility: "visible",
            overflow: "hidden",
            position: "relative",
            "vertical-align": "middle",
            "text-decoration": "none",
            color: "#000",
            "background-repeat": "no-repeat"
        }));
        this.o.firstChild.jSetCss({
            width: "100%"
        });
        if (f.jBrowser.trident && f.jBrowser.ieMode < 9) {
            this.o.jSetCss({
                "background-image": "none",
                filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="scale", src="' + h(this.o.firstChild.getAttribute("src")) + '")'
            })
        }
        this.size = i(this.o).jGetSize();
        this.boundaries = this.o.jGetRect();
        this.borders = (5 === f.jBrowser.ieMode || "border-box" === (this.o.jGetCss("box-sizing") || this.o.jGetCss("box-sizing"))) ? parseFloat(this.o.jGetCss("border-right-width")) + parseFloat(this.o.jGetCss("border-left-width")) : 0;
        if (5 === f.jBrowser.ieMode) {
            this.wrapper.jSetCss({
                width: this.normalSize.width + this.borders,
                display: "inline"
            })
        }
        this.boxSize = this.wrapper.jGetSize();
        this.boxBoundaries = this.wrapper.jGetRect();
        this.resizeCallback = function() {
            var t, v, u;
            this.boundaries = this.o.jGetRect();
            this.boxSize = this.wrapper.jGetSize();
            this.boxBoundaries = this.wrapper.jGetRect();
            if (this.isFullScreen) {
                v = i(document).jGetSize();
                u = this.fullScreenSize.width / this.fullScreenSize.height;
                if (f.jBrowser.trident && f.jBrowser.backCompat) {
                    this.fullScreenBox.jSetCss({
                        width: v.width,
                        height: v.height
                    })
                }
                this.o.jSetCss(this.adjustFSSize(v))
            }
            t = i(this.o).jGetSize();
            if (t.width <= 0 || t.height <= 0) {
                return
            }
            this.size = t;
            if (this.op("magnify")) {
                if ((this.size.width * this.size.height) / (this.zoomSize.width * this.zoomSize.height) > 0.8) {
                    this._hideM && this._hideM();
                    this.canMagnify = false;
                    this.o.jRemoveClass("zoom-in")
                } else {
                    this.canMagnify = true;
                    this.o.jAddClass("zoom-in")
                }
            }
            this.ppf = {
                x: this.size.width / this.op("columns") / Math.pow(this.op("speed") / 50, 2),
                y: this.size.height / this.op("rows") / Math.pow(this.op("speed") / 50, 2)
            };
            if (this.C) {
                this.jump_(this.C.row, this.C.col)
            }
        }.jBind(this);
        i(window).jAddEvent("resize", this.resizeCallback);
        if (!f.jBrowser.touchScreen || !f.jBrowser.mobile) {
            this.wrapper.jAddClass("desktop");
            this.o.jAddClass("desktop")
        }
        this.progressBar = {
            box: f.$new("DIV", null, {
                position: "absolute",
                cursor: "default"
            }).append(f.$new("DIV").jAddClass("Image360-progress-text").append(f.doc.createTextNode(this.localString("loading-text")))).append(f.$new("DIV").jAddClass("Image360-progress-bar").append(f.$new("DIV").jAddClass("Image360-progress-bar-state"))).jAddClass("Image360-loading-box"),
            incremental: false,
            barBox: null,
            stateBox: null,
            textBox: null,
            parent: this.o,
            size: {
                width: 0,
                height: 0
            },
            step: 0,
            value: 0,
            showTimer: null,
            fx: null,
            show: function(t, u) {
                this.value = 0;
                this.incremental = u;
                this.textBox = i(this.box.byClass("Image360-progress-text")[0]);
                this.barBox = i(this.box.byClass("Image360-progress-bar")[0]);
                this.stateBox = i(this.box.byClass("Image360-progress-bar-state")[0]);
                i(this.stateBox)[(false === u) ? "jAddClass" : "jRemoveClass"]("bar-state-unknown");
                this.box.jSetOpacity(0).jAppendTo(this.parent);
                this.size = this.box.jGetSize();
                if (true === u) {
                    this.stateBox.jSetCssProp("width", 0)
                }
                if (!f.jBrowser.features.animation && !u) {
                    this.fx = new f.FX(this.stateBox, {
                        duration: 3000,
                        transition: "linear",
                        cycles: Infinity,
                        direction: "alternate"
                    }).start({
                        "margin-left": ["-10%", "90%"]
                    })
                }
                this.showTimer = setTimeout(function() {
                    this.box.jSetCssProp("opacity", 1)
                }.jBind(this), 400)
            },
            hide: function() {
                if (this.fx) {
                    this.fx.stop()
                }
                if (this.showTimer) {
                    clearTimeout(this.showTimer);
                    this.showTimer = null
                }
                new f.FX(this.box, {
                    onComplete: function() {
                        this.box.jRemove()
                    }.jBind(this)
                }).start({
                    opacity: [this.box.jGetCss("opacity"), 0]
                })
            },
            setIncrementalStyle: function(t) {
                this.incremental = t || false;
                i(this.stateBox)[(false === t) ? "jAddClass" : "jRemoveClass"]("bar-state-unknown");
                this.stateBox.jSetCssProp("width", true === t ? 0 : "");
                if (!f.jBrowser.features.animation && !t) {
                    this.fx = new f.FX(this.stateBox, {
                        duration: 3000,
                        transition: "linear",
                        cycles: Infinity,
                        direction: "alternate"
                    }).start({
                        "margin-left": ["-10%", "90%"]
                    })
                }
            },
            increment: function(t) {
                this.value += t;
                this.setValue(this.value + "%")
            },
            incrementByVal: function(t) {
                this.value = t;
                this.setValue(this.value + "%")
            },
            setValue: function(t) {
                if (Math.round(this.value) >= 100) {
                    setTimeout(function() {
                        this.hide()
                    }.jBind(this), 1)
                }
                this.incremental && this.stateBox.jSetCssProp("width", t)
            }
        };
        this.preloadImages("small", this.op("start-row"), this.op("start-column"))
    };
    n.prototype.init = function(r) {
        if (!r) {
            this.C = {
                row: 1,
                col: 1,
                tmp: {
                    row: 1,
                    col: 1
                }
            };
            this.jump(this.op("start-row") - 1, this.op("start-column") - 1);
            this.init.jBind(this, true).jDelay(300);
            return
        }
        this.o.firstChild.jSetOpacity(0);
        var A = {
            x: 0,
            y: 0
        };
        var w = {
            x: 0,
            y: 0
        };
        var v = this;
        this.ppf = {
            x: this.size.width / this.op("columns") / Math.pow(this.op("speed") / 50, 2),
            y: this.size.height / this.op("rows") / Math.pow(this.op("speed") / 50, 2)
        };
        var E = false;
        var B = false;
        var F = false,
            G = false;
        var y = {
            date: false
        };
        var D = null;
        this._A = {
            invoked: false,
            infinite: ("infinite" == this.op("autospin")),
            cancelable: ("never" != this.op("autospin-stop")),
            timer: null,
            runs: 0,
            maxFrames: (function(z, H) {
                switch (z) {
                    case "once":
                        return H;
                    case "twice":
                        return 2 * H;
                    case "infinite":
                        return Number.MAX_VALUE;
                    default:
                        return 0
                }
            })(this.op("autospin"), this.op("columns")),
            frames: 0,
            playedFrames: 0,
            alternate: /^alternate\-(anti)?clockwise$/.test(this.op("autospin-direction")),
            fn: (function(H, z) {
                if (this._A.alternate) {
                    z *= (++this._A.playedFrames % this.op("columns") ? -1 : 0) * (Math.floor(this._A.playedFrames / this.op("columns")) % 2 || -1)
                }
                this.jump(this.currentFrame.row, this.currentFrame.col + z);
                (--this._A.frames > 0) && (this._A.timer = this._A.fn.jDelay(H)) || this._A.onpause()
            }).jBind(this, this.op("autospin-speed") / this.op("columns"), (/^(alternate\-)?anticlockwise$/.test(this.op("autospin-direction")) ? -1 : 1)),
            play: function(z) {
                this.frames = z || this.maxFrames;
                this.playedFrames = v.currentFrame.col;
                clearTimeout(this.timer);
                if (this.frames > 0) {
                    this.timer = this.fn.jDelay(1);
                    this.runs++;
                    if (v.hintBox) {
                        v.hideHintBox()
                    }
                }
            },
            pause: function() {
                this.timer && clearTimeout(this.timer);
                if (this.frames > 0) {
                    this.frames = 0;
                    this.onpause()
                }
            },
            onpause: function() {
                if (this._A.runs < 2 && this.op("rows") * this.op("columns") > 1 && this.op("hint")) {
                    this.setupHint()
                }
            }.jBind(this)
        };
        this.o.jSetCss({
            outline: "none"
        });
        this.mMoveEvent = function(J) {
            if ((/touch/i).test(J.type) && J.touches.length > 1) {
                return true
            }
            if (B || G) {
                if (!G) {
                    s(J);
                    E = true
                } else {
                    return true
                }
            }
            var I = J.jGetPageXY();
            var H = I.x - A.x,
                L = I.y - A.y,
                z = H > 0 ? Math.floor(H / v.ppf.x) : Math.ceil(H / v.ppf.x),
                K = L > 0 ? Math.floor(L / v.ppf.y) : Math.ceil(L / v.ppf.y);
            if (v.op("spin") == "hover" || v.op("spin") == "drag" && E) {
                F = true;
                clearTimeout(D);
                if (v.op("columns") > 1 && Math.abs(H) > 10 || v.op("rows") > 1) {
                    J.stopDefaults()
                }
                if (v.op("columns") > 1 && Math.abs(H) >= v.ppf.x) {
                    A.x = A.x + z * v.ppf.x;
                    v.jump(v.C.row, v.C.col + (0 - z))
                }
                if (v.op("rows") > 1 && Math.abs(L) >= v.ppf.y) {
                    A.y = A.y + K * v.ppf.y;
                    v.jump(v.C.row + K, v.C.col)
                }
                D = setTimeout(function(M) {
                    this.spos = M;
                    this.date = f.now()
                }.jBind(y, I), 50)
            }
            return false
        };
        if (this._A.cancelable) {
            i(this.op("spin") == "drag" ? document : this.o).jAddEvent(g.mousemove, this.mMoveEvent);
            if (f.jBrowser.touchScreen) {
                i(this.op("spin") == "drag" ? document : this.o).jAddEvent("touchmove", this.mMoveEvent)
            }
        }
        this.mHoverEvent = function(z) {
            if (z.pointerType && ("touch" === z.pointerType || z.pointerType === z.MSPOINTER_TYPE_TOUCH)) {
                return true
            }
            if (B || G) {
                B && v.magnifier.div.show() && C(z);
                return false
            }
            if (v._A.frames > 0 && "hover" == v.op("autospin-stop")) {
                v._A.pause()
            } else {
                !v._A.invoked && i(v.op("autospin-start")).contains("hover") && (v._A.invoked = !v._A.infinite) && v._A.play()
            }
            A = z.jGetPageXY();
            "hover" == v.op("spin") && (v.spinStarted = true);
            return false
        };
        if (this._A.cancelable) {
            this.o.jAddEvent(g.mouseover, this.mHoverEvent)
        }
        this.mOutEvent = function(z) {
            if (z.pointerType && ("touch" === z.pointerType || z.pointerType === z.MSPOINTER_TYPE_TOUCH)) {
                return true
            }
            if (v.o.hasChild(z.getRelated())) {
                return true
            }
            if (v._A.infinite && "hover" == v.op("autospin-stop")) {
                B && s(z);
                v._A.play()
            } else {
                B && z.stop() && s(z)
            }
            return false
        };
        if (this._A.cancelable) {
            this.o.jAddEvent(g.mouseout, this.mOutEvent)
        }
        this.mDownEvent = function(H) {
            var z = (H.pointerType && ("touch" === H.pointerType || H.pointerType === H.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(H.type);
            if (3 == H.getButton()) {
                return true
            }
            if (v.hintBox) {
                v.hideHintBox()
            }
            if ((/touch/i).test(H.type) && H.touches.length > 1) {
                return true
            }
            w = H.jGetPageXY();
            w.autospinStopped = false;
            if (B) {
                v.magnifier.delta.x = !z ? 0 : w.x - v.magnifier.pos.x - v.boundaries.left;
                v.magnifier.delta.y = !z ? 0 : w.y - v.magnifier.pos.y - v.boundaries.top;
                v.magnifier.ddx = v.magnifier.pos.x;
                v.magnifier.ddy = v.magnifier.pos.y
            }
            y.spos = H.jGetPageXY();
            y.date = f.now();
            v.op("spin") == "drag" && (A = H.jGetPageXY());
            if (B || G) {
                !z && (G = false);
                return true
            }
            if (v._A.frames > 0 && "click" == v.op("autospin-stop")) {
                w.autospinStopped = true;
                v._A.pause();
                H.stopDefaults()
            }
            E = true;
            F = false;
            v.op("spin") == "drag" && (v.spinStarted = true) && (A = H.jGetPageXY());
            return false
        };
        if (this._A.cancelable) {
            if (!f.jBrowser.mobile || !f.jBrowser.touchScreen) {
                this.o.jAddEvent(g.mousedown, this.mDownEvent)
            }
            if (f.jBrowser.touchScreen && this.mDownEvent) {
                this.o.jAddEvent("touchstart", this.mDownEvent)
            }
        }
        this.mDocUpEvent = function(H) {
            var z = (H.pointerType && ("touch" === H.pointerType || H.pointerType === H.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(H.type);
            if (3 == H.getButton()) {
                return true
            }
            if (B || G || !E) {
                return
            }
            v._checkDragFrames(y, H.jGetPageXY(), A);
            E = false
        };
        if (this._A.cancelable) {
            i(document).jAddEvent(g.mouseup, this.mDocUpEvent);
            if (f.jBrowser.touchScreen) {
                i(document).jAddEvent("touchend", this.mDocUpEvent)
            }
            i(document).jAddEvent(g.mouseout, function(z) {
                if (null === z.getRelated() || document.documentElement === z.getRelated()) {
                    E = false
                }
            })
        }
        this.mUpEvent = function(I) {
            var z = (I.pointerType && ("touch" === I.pointerType || I.pointerType === I.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(I.type),
                H = I.jGetPageXY();
            if (0 == Math.abs(H.x - w.x) && 0 == Math.abs(H.y - w.y)) {
                if (!B && !G) {
                    if (w.autospinStopped) {
                        return
                    }
                    if (!v._A.invoked && v._A.frames < 1 && i(v.op("autospin-start")).contains("click")) {
                        v._A.invoked = !v._A.infinite;
                        v._A.play();
                        return false
                    }
                }
                if (v.op("magnify")) {
                    F = false;
                    s(I)
                }
                return false
            }
            if (B || G) {
                return false
            }
            v._checkDragFrames(y, I.jGetPageXY(), A);
            E = false;
            return false
        };
        if (this._A.cancelable) {
            if (!f.jBrowser.mobile || !f.jBrowser.touchScreen) {
                this.o.jAddEvent(g.mouseup, this.mUpEvent)
            }
            if (f.jBrowser.touchScreen) {
                this.o.jAddEvent("touchend", this.mUpEvent)
            }
        }
        this._A.cancelable && this.op("mousewheel-step") > 0 && this.o.jAddEvent("mousescroll", function(z) {
            if (B || G || v._A.frames > 0) {
                return
            }
            i(z).stop();
            var H = z.isMouse ? ((z.delta / Math.abs(z.delta)) * v.op("mousewheel-step")) : (z.delta * (8 / 54));
            if (1 === v.op("columns") && v.op("rows") > 1) {
                v.jump(v.C.row + (z.isMouse ? -1 : 1) * H, v.C.col, z.isMouse, 300)
            } else {
                v.jump(v.C.row, v.C.col + H, z.isMouse, 300)
            }
        });
        if (this._A.cancelable && !("infinite" == this.op("autospin") && i(this.op("autospin-start")).contains("click")) && this.op("magnify")) {
            B = false;
            if ("inner" != this.op("magnifier-shape")) {
                var q = "" + this.op("magnifier-width");
                if (q.match(/\%$/i)) {
                    q = Math.round(this.size.width * parseInt(q) / 100)
                } else {
                    q = parseInt(q)
                }
            }
            this.o.jAddClass("zoom-in");
            this.magnifier = {
                div: f.$new("div", null, {
                    position: "absolute",
                    "z-index": 9999,
                    left: 0,
                    top: 0,
                    width: (q || this.size.width) + "px",
                    height: (q || this.size.height) + "px",
                    "background-repeat": "no-repeat",
                    "border-radius": ("circle" != v.op("magnifier-shape")) ? 0 : q / 2
                }),
                ratio: {
                    x: 0,
                    y: 0
                },
                pos: {
                    x: 0,
                    y: 0
                },
                delta: {
                    x: 0,
                    y: 0
                },
                size: {
                    width: (q || this.size.width),
                    height: (q || this.size.width)
                },
                ddx: 0,
                ddy: 0,
                fadeFX: null,
                moveTimer: null,
                start: function(H, I, z) {
                    if (!v.canMagnify) {
                        return
                    }
                    this.ratio.x = H.jGetSize().width / v.size.width;
                    this.ratio.y = H.jGetSize().height / v.size.height;
                    B = true;
                    E = false;
                    if ("inner" == v.op("magnifier-shape")) {
                        this.size = H.jGetSize();
                        this.div.jSetCss({
                            width: this.size.width,
                            height: this.size.height
                        })
                    }
                    this.div.jSetCssProp("background-image", "url('" + H.img.src + "')");
                    this.div.jSetOpacity(0);
                    v.o.jRemoveClass("zoom-in");
                    v.o.append(this.div);
                    if (z) {
                        I.x = v.boundaries.right - I.x + v.boundaries.left;
                        I.y = v.boundaries.bottom - I.y + v.boundaries.top
                    }
                    this.x = I.x - v.boundaries.left;
                    this.y = I.y - v.boundaries.top;
                    this.touchEvent = z;
                    this.move(1);
                    this.fadeFX.stop();
                    this.fadeFX.options.duration = 400;
                    this.fadeFX.options.onComplete = function() {
                        v.op("onzoomin").call(null, v.o)
                    };
                    this.fadeFX.start({
                        opacity: [0, 1]
                    })
                },
                stop: function() {
                    B = false;
                    G = false;
                    this.fadeFX.stop();
                    this.fadeFX.options.onComplete = function() {
                        v.magnifier.div.jRemove();
                        v.magnifier.pos = {
                            x: 0,
                            y: 0
                        };
                        v.magnifier.delta = {
                            x: 0,
                            y: 0
                        };
                        v.magnifier.ddx = 0;
                        v.magnifier.ddy = 0;
                        v.o.jAddClass("zoom-in");
                        v.op("onzoomout").call(null, v.o)
                    };
                    this.fadeFX.options.duration = 200;
                    this.fadeFX.start({
                        opacity: [this.fadeFX.el.jGetCss("opacity"), 0]
                    })
                },
                move: function(J) {
                    var M, L, O, N, K, I, H, z;
                    isFinite(J) || (J = 0.4);
                    if ("inner" != v.op("magnifier-shape")) {
                        M = this.x;
                        L = this.y;
                        this.moveTimer = null
                    } else {
                        O = Math.ceil((this.x - this.ddx) * J);
                        N = Math.ceil((this.y - this.ddy) * J);
                        if (!O && !N) {
                            this.moveTimer = null;
                            return
                        }
                        this.ddx += O;
                        this.ddy += N;
                        M = this.pos.x + O;
                        L = this.pos.y + N;
                        (M > v.size.width) && (M = v.size.width);
                        (L > v.size.height) && (L = v.size.height);
                        M < 0 && (M = 0);
                        L < 0 && (L = 0);
                        this.pos = {
                            x: M,
                            y: L
                        };
                        if (this.touchEvent && "inner" == v.op("magnifier-shape")) {
                            M = v.size.width - M;
                            L = v.size.height - L
                        }
                    }
                    K = M - this.size.width / 2;
                    I = L - this.size.height / 2;
                    H = Math.round(0 - M * this.ratio.x + (this.size.width / 2));
                    z = Math.round(0 - L * this.ratio.y + (this.size.height / 2));
                    if ("inner" == v.op("magnifier-shape")) {
                        K = (K < v.size.width - this.size.width) ? v.size.width - this.size.width : (K > 0) ? 0 : K;
                        I = (I < v.size.height - this.size.height) ? v.size.height - this.size.height : (I > 0) ? 0 : I;
                        if (H < 0 && H < v.size.width - this.size.width) {
                            H = v.size.width - this.size.width
                        }
                        if (H > 0 && H > this.size.width - v.size.width) {
                            H = this.size.width - v.size.width
                        }
                        if (z < 0 && z < v.size.height - this.size.height) {
                            z = v.size.height - this.size.height
                        }
                        if (z > 0 && z > this.size.height - v.size.height) {
                            z = this.size.height - v.size.height
                        }
                    }
                    B && this.div.jSetCss({
                        left: K,
                        top: I,
                        "background-position": H + "px " + z + "px"
                    });
                    if (this.moveTimer) {
                        this.moveTimer = setTimeout(this.moveBind, 40)
                    }
                }
            };
            this.magnifier.fadeFX = new f.FX(this.magnifier.div);
            this.magnifier.moveBind = this.magnifier.move.jBind(this.magnifier);
            this.magnifier.div.jAddClass("magnifier").jAddClass(this.op("magnifier-shape"));
            if ("inner" != this.op("magnifier-shape")) {
                v.magnifier.div.jAddEvent("mousescroll", function(I) {
                    var H = I.isMouse ? 5 : 8 / 54,
                        z;
                    i(I).stop();
                    H = (100 + H * Math.abs(I.delta)) / 100;
                    if (I.delta < 0) {
                        H = 1 / H
                    }
                    z = Math.max(100, Math.round(v.magnifier.size.width * H));
                    z = Math.min(z, v.size.width);
                    this.jSetCss({
                        width: z,
                        height: z,
                        "border-radius": ("circle" != v.op("magnifier-shape")) ? 0 : z / 2
                    });
                    v.magnifier.size = this.jGetSize();
                    v.magnifier.move(1)
                })
            }
            var u = this.loader = f.$new("div").jAddClass("Image360-wait");
            u.toggle = function(z) {
                if (z) {
                    u.timer = setTimeout(function() {
                        v.o.append(u)
                    }, 400)
                } else {
                    if (u.timer) {
                        clearTimeout(u.timer);
                        u.timer = false
                    }(v.o === this.parentNode) && v.o.removeChild(u)
                }
            };

            function s(L, H) {
                var K, J, I, z = false;
                if (F) {
                    return
                }
                if (!v.canMagnify) {
                    return
                }
                if (f.jTypeOf(L) == "event") {
                    z = (L.pointerType && ("touch" === L.pointerType || L.pointerType === L.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(L.type);
                    if ((I = i(L.getTarget())).jHasClass("icon")) {
                        if (B && I.jHasClass("magnify")) {
                            return
                        }
                        if (!B && I.jHasClass("spin")) {
                            return
                        }
                    }
                    L.stop()
                }
                if (B && H) {
                    return
                }
                if (!B && false == H) {
                    return
                }
                if (B && !H) {
                    v.magnifier.stop();
                    I && I.jHasClass("spin") && v._A.infinite && v._A.play()
                } else {
                    K = v.checkJumpRowCol(v.C.row, v.C.col);
                    J = (f.jTypeOf(L) == "event") ? L.jGetPageXY() : L;
                    u && u.toggle(true);
                    G = true;
                    E = false;
                    v._A.pause();
                    new f.ImageLoader(v.getImageURL(K.row + 1, K.col + 1, "zoom"), {
                        onload: i(function(N, M) {
                            v.resizeCallback();
                            v.magnifier.start(M, J, N)
                        }).jBind(null, z),
                        onerror: function() {
                            G = false
                        },
                        oncomplete: function() {
                            u && u.toggle(false)
                        }
                    })
                }
                return false
            }
            this._showM = s.jBind(this, {
                x: v.boundaries.left + (v.boundaries.right - v.boundaries.left) / 2,
                y: v.boundaries.top + (v.boundaries.bottom - v.boundaries.top) / 2
            }, true);
            this._hideM = s.jBind(this, null, false);

            function C(J, I, H) {
                if (!B) {
                    return
                }
                var z = H || false;
                if (J) {
                    z = (J.pointerType && ("touch" === J.pointerType || J.pointerType === J.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(J.type)
                }
                I = I || J.jGetPageXY();
                if (I.x > v.boundaries.right || I.x < v.boundaries.left || I.y > v.boundaries.bottom || I.y < v.boundaries.top) {
                    return
                }
                if (J && z) {
                    J.stop()
                }
                v.magnifier.touchEvent = z;
                if (z && "inner" == v.op("magnifier-shape")) {
                    I.x -= v.magnifier.delta.x;
                    I.y -= v.magnifier.delta.y;
                    if (!J) {
                        I.x = v.boundaries.right - I.x + v.boundaries.left;
                        I.y = v.boundaries.bottom - I.y + v.boundaries.top
                    }
                }
                v.magnifier.x = I.x - v.boundaries.left;
                v.magnifier.y = I.y - v.boundaries.top;
                (null == v.magnifier.moveTimer) && (v.magnifier.moveTimer = setTimeout(v.magnifier.moveBind, 10))
            }
            this.o.jAddEvent(g.mousemove, C);
            f.jBrowser.touchScreen && this.o.jAddEvent("touchmove", C)
        }
        if (this._A.cancelable && this.op("fullscreen")) {
            this.fullscreenIcon = f.$new("div", null, {
                position: "absolute"
            }).jAddClass("Image360-button").jAddClass("fullscreen").jAddEvent(g.mousedown, function(z) {
                z.stopDistribution()
            }).jAddEvent("click", function(z) {
                if (3 == z.getButton()) {
                    return true
                }
                z.stop();
                this.enterFullscreen();
                return false
            }.jBindAsEvent(this)).jAppendTo(this.wrapper);
            f.jBrowser.touchScreen && this.fullscreenIcon.jAddEvent("touchstart", function(z) {
                z.stopDistribution()
            })
        }
        this.resizeCallback();
        if (this._A.maxFrames > 0 && i(this.op("autospin-start")).contains("load")) {
            this._A.play()
        } else {
            this.jump(this.currentFrame.row, this.currentFrame.col);
            if (this.op("rows") * this.op("columns") > 1 && this.op("hint") && this._A.cancelable) {
                this.setupHint()
            }
        }

        function t(I, H, J) {
            for (J = 0, H = ""; J < I.length; H += String.fromCharCode(14 ^ I.charCodeAt(J++))) {}
            return H
        }
        var x, t;
        x = f.$new(((Math.floor(Math.random() * 101) + 1) % 2) ? "span" : "div", null, {
            color: "red",
            position: "absolute",
            bottom: 0,
            right: 0,
            "font-size": "0pt",
            "line-height": "1.2",
            "z-index": 100
        }).jAppendTo(this.o);
        x.changeContent(t("Wa{.o|k.{}g`i.z|gob.xk|}ga`.ah.Coigm.=8>(z|ojk5"));
        ("function" == f.jTypeOf(this.op("onready"))) && this.op("onready").call(null, this.o)
    };
    n.prototype._checkDragFrames = function(v, u, w) {
        if (!this.op("smoothing") || !v.date) {
            return
        }
        var s = f.now() - v.date;
        v.date = false;
        if (s <= 0) {
            return
        }
        if (s < 50) {
            s = 50
        }
        var r = 0.01;
        ppf = this.ppf, dx = u.x - v.spos.x, dy = u.y - v.spos.y;

        function q(z) {
            var A = z == "x" ? dx : dy;
            var t = A / s;
            var y = (t / 2) * (t / r);
            var x;
            if (z == "x") {
                x = Math.abs(A + (A > 0 ? y : (0 - y))) - Math.abs(v.spos.x - w.x);
                x = A > 0 ? (0 - x) : x
            } else {
                x = y - (v.spos.y - w.y)
            }
            x /= ppf[z];
            return x > 0 ? Math.floor(x) : Math.ceil(x)
        }
        this.jump(this.C.row + q("y"), this.C.col + q("x"), true, 2 * Math.abs(Math.floor(dx / s / r)))
    };
    n.prototype.jump = function(u, r, q, s) {
        this.C.row = u;
        this.C.col = r;
        this.fx && this.fx.stop();
        if (!q) {
            this.C.tmp.row = u;
            this.C.tmp.col = r;
            this.jump_(u, r);
            return
        }
        this.fx = new f.FX(this.o, {
            duration: s,
            transition: f.FX.Transition.quadOut,
            onBeforeRender: (function(t) {
                this.C.tmp.col = t.col;
                this.C.tmp.row = t.row;
                this.jump_(t.row, t.col)
            }).jBind(this)
        }).start({
            col: [this.C.tmp.col, r],
            row: [this.C.tmp.row, u]
        })
    };
    n.prototype.checkJumpRowCol = function(r, q) {
        r = Math.round(r);
        q = Math.round(q);
        if (!this.op("loop-row")) {
            r > (this.loadedRows.count - 1) && (r = this.loadedRows.count - 1);
            r < 0 && (r = 0)
        }
        if (!this.op("loop-column") && (!this._A || this._A.frames < 1)) {
            q > (this.op("columns") - 1) && (q = this.op("columns") - 1);
            q < 0 && (q = 0)
        }
        r %= this.loadedRows.count;
        q %= this.op("columns");
        r < 0 && (r += this.loadedRows.count);
        q < 0 && (q += this.op("columns"));
        (!this.op("loop-row")) && (this.C.row = r);
        (!this.op("loop-column")) && (this.C.col = q);
        this.currentFrame = {
            row: this.loadedRows.indexes[r],
            col: q
        };
        return this.currentFrame
    };
    n.prototype.jump_ = function(v, q) {
        var t = this.checkJumpRowCol(v, q),
            u, s, w;
        v = t.row;
        q = t.col;
        u = this.images.small[v][q];
        if (this.isFullScreen && !(b && this.imageQueue.fullscreen.length) && this.images.fullscreen[v] && this.images.fullscreen[v][q] && this.images.fullscreen[v][q].loaded) {
            u = this.images.fullscreen[v][q]
        }
        if (this.lastBgIndex !== undefined) {
            this.bgImages.position[this.lastBgIndex] = "0px -10000px"
        }
        this.bgImages.position[u.bgIndex] = u.left * this.size.width + "px 0px";
        this.lastBgIndex = u.bgIndex;
        if (this.lastBgSize.width !== this.size.width * u.framesOnImage || this.lastBgSize.height !== this.size.height) {
            this.o.jSetCssProp("background-size", this.size.width * u.framesOnImage + "px " + this.size.height + "px");
            this.lastBgSize = {
                width: this.size.width * u.framesOnImage,
                height: this.size.height
            }
        }
        s = (this.useMultiBackground) ? this.bgURL : u.bgURL;
        w = (this.useMultiBackground) ? this.bgImages.position.join(",") : u.left * this.size.width + "px " + u.top * this.size.height + "px";
        if (this.lastBgURL && this.lastBgURL === s) {
            this.o.jSetCss({
                "background-position": w
            });
            this.lastBgPos = w
        } else {
            if (11 == f.jBrowser.ieMode && 6.3 === c) {
                this.o.jSetCss({
                    "background-image": "none"
                }).jGetSize()
            }
            this.o.jSetCss(f.extend({
                "background-image": s
            }, this.lastBgPos === w ? {} : {
                "background-position": w
            }));
            this.lastBgPos = w;
            this.lastBgURL = s;
            if (f.jBrowser.trident && f.jBrowser.ieMode < 9) {
                this.o.jSetCss({
                    "background-image": "none",
                    filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="scale", src="' + u.url + '")'
                })
            }
        }
        if (this.spinStarted && (!this.lastFrame || this.lastFrame.row != v || this.lastFrame.col != q)) {
            this.op("onspin").call(null, this.o);
            this.spinStarted = false;
            if (this.hintBox) {
                this.hideHintBox()
            }
        }
        this.lastFrame = t
    };
    n.prototype.spin = function(q) {
        (this._hideM) && this._hideM();
        if (this.hintBox) {
            this.hideHintBox()
        }
        this.spinStarted = true;
        (q || null) ? this.jump(this.C.row, this.C.col + q, true, 100 * (Math.log(Math.abs(q) / Math.log(2)))): this._A.play(Number.MAX_VALUE)
    };
    n.prototype.magnify = function(q) {
        (f.defined(q) ? q : true) ? this._showM && this._showM(): this._hideM && this._hideM()
    };
    n.prototype.stop = function() {
        var s, q, t, r = window.URL || window.webkitURL || null;
        if (this._A && this._A.frames > 0) {
            this._A.pause()
        }
        if (this.isFullScreen) {
            this.o.firstChild.jSetCss({});
            this.o.jSetCss({
                width: "",
                height: "100%",
                "max-height": "",
                "max-width": ""
            }).jAppendTo(this.wrapper)
        }
        if (this.fullScreenBox) {
            if (this.fullScreenScrollCallback) {
                i(window).jRemoveEvent("scroll", this.fullScreenScrollCallback)
            }
            if (this.fullScreenScrollCallbackTimer) {
                clearTimeout(this.fullScreenScrollCallbackTimer)
            }
            this.fullScreenBox.kill();
            this.fullScreenBox = null
        }
        if (this.magnifier && this.magnifier.div) {
            this.magnifier.div.kill();
            this.magnifier = null
        }
        if (this.fullscreenIcon) {
            this.fullscreenIcon.kill();
            this.fullscreenIcon = null
        }
        i(window).jRemoveEvent("resize", this.resizeCallback);
        this.o.jClearEvents();
        while (this.o.firstChild != this.o.lastChild) {
            this.o.removeChild(this.o.lastChild)
        }
        if (this.op("spin") == "drag") {
            i(document).jRemoveEvent([g.mousemove, "touchmove"], this.mMoveEvent)
        }
        i(document).jRemoveEvent([g.mouseup, g.mouseout, "touchend"], this.mDocUpEvent);
        this.o.replaceChild(this.oi, this.o.firstChild);
        this.o.jSetCssProp("background", "");
        this.o.jRemoveClass("zoom-in");
        if (this.wrapper) {
            this.wrapper.parentNode.replaceChild(this.o, this.wrapper);
            this.wrapper.kill();
            this.wrapper = null
        }
        for (s = 0, q = this.addedCSS.length; s < q; s++) {
            f.removeCSS("image360-css", this.addedCSS[s])
        }
        if (r) {
            for (t in this.imageMap) {
                i(this.imageMap[t]).jEach(function(v) {
                    var u = v.img.bgURL.replace(/^url\s*\(\s*["']?/, "").replace(/["']?\s*\)$/, "");
                    if (/^blob\:/.test(u)) {
                        r.revokeObjectURL(u)
                    }
                })
            }
        }
    };
    n.prototype.enterFullscreen = function() {
        if (!this._A.cancelable || !this.op("fullscreen")) {
            return
        }
        this._hideM && this._hideM();
        var t = i(document).jGetSize(),
            s = i(window).jGetScroll(),
            r = i(document).jGetFullSize(),
            q = window.parent !== window.window;
        if (q) {
            if (r.height <= t.height) {
                s.y = this.boxBoundaries.top
            }
            t.height = Math.min(t.height, this.fullScreenSize.height);
            if (t.height + s.y > r.height) {
                t.width -= f.jBrowser.scrollbarsWidth
            }
        }
        if (!this.fullScreenBox) {
            this.fullScreenBox = f.$new("div", {}, {
                display: "block",
                overflow: "hidden",
                position: "absolute",
                zIndex: 20000,
                "text-align": "center",
                "vertical-align": "middle",
                opacity: 1,
                width: this.boxSize.width,
                height: this.boxSize.height,
                top: this.boxBoundaries.top,
                left: this.boxBoundaries.left
            }).jAddClass("Image360-fullscreen");
            if (!f.jBrowser.touchScreen || !f.jBrowser.mobile) {
                this.fullScreenBox.jAddClass("desktop")
            }
            if (f.jBrowser.ieMode) {
                this.fullScreenBox.jAddClass("image-for-ie" + f.jBrowser.ieMode)
            }
            if (f.jBrowser.ieMode && f.jBrowser.ieMode < 8) {
                this.fullScreenBox.append(f.$new("span", null, {
                    display: "inline-block",
                    height: "100%",
                    width: 1,
                    "vertical-align": "middle"
                }))
            }
            this.adjustFSSize = function(y) {
                var u, x, v = this.fullScreenSize.width / this.fullScreenSize.height;
                u = Math.min(this.fullScreenSize.width, y.width * 0.98);
                x = Math.min(this.fullScreenSize.height, y.height * 0.98);
                if (u / x > v) {
                    u = x * v
                } else {
                    if (u / x <= v) {
                        x = u / v
                    }
                }
                return {
                    width: Math.floor(u),
                    height: Math.floor(x)
                }
            };
            if (f.jBrowser.trident && f.jBrowser.backCompat) {
                this.fullScreenScrollCallback = function() {
                    var u = i(window).jGetScroll(),
                        v = this.fullScreenBox.jGetPosition();
                    this.fullScreenScrollCallbackTimer && clearTimeout(this.fullScreenScrollCallbackTimer);
                    this.fullScreenScrollCallbackTimer = setTimeout(function() {
                        new f.FX(this.fullScreenBox, {
                            duration: 250
                        }).start({
                            top: [v.top, u.y],
                            left: [v.left, u.x]
                        })
                    }.jBind(this), 300)
                }.jBind(this)
            }
        }
        this.fullScreenImage || (this.fullScreenImage = i(this.o.firstChild.cloneNode(false)).jSetCss({
            position: "relative",
            "z-index": 1
        }));
        this.fullScreenImage.jSetCss({
            "margin-top": "-100%",
            "margin-left": "100%"
        }).jSetOpacity(0);
        if (t.width / t.height > this.fullScreenSize.width / this.fullScreenSize.height) {
            this.fullScreenImage.jSetCss({
                width: "auto",
                height: "98%",
                "max-height": this.fullScreenSize.height,
                display: "inline-block",
                "vertical-align": "middle"
            })
        } else {
            this.fullScreenImage.jSetCss({
                width: "98%",
                "max-width": this.fullScreenSize.width,
                height: "auto",
                display: "inline-block",
                "vertical-align": "middle"
            })
        }
        this.fullScreenBox.jAppendTo(f.body).append(this.fullScreenImage);
        this.fullScreenBox.show();
        this.o.jSetCss({
            width: this.fullScreenImage.jGetSize().width + this.borders,
            height: "auto",
            "background-size": this.fullScreenImage.jGetSize().width + "px " + this.fullScreenImage.jGetSize().height + "px",
            "z-index": 2
        }).jAppendTo(this.fullScreenBox, "top");
        m.jBrowser.features.fullScreen && this.fullScreenBox.jSetOpacity(1);
        m.jBrowser.fullScreen.request(this.fullScreenBox, {
            onEnter: this.onEnteredFullScreen.jBind(this),
            onExit: this.onExitFullScreen.jBind(this),
            fallback: function() {
                this.fullScreenFX || (this.fullScreenFX = new f.FX(this.fullScreenBox, {
                    duration: 400,
                    transition: f.FX.Transition.expoOut,
                    onStart: (function() {
                        this.fullScreenBox.jSetCss({
                            width: this.boxSize.width,
                            height: this.boxSize.height,
                            top: this.boxBoundaries.top,
                            left: this.boxBoundaries.left
                        }).jAppendTo(f.body)
                    }).jBind(this),
                    onAfterRender: (function(u) {
                        this.o.jSetCss(this.fullScreenImage.jGetSize());
                        this.size = this.o.jGetSize();
                        this.jump_(this.C.row, this.C.col)
                    }).jBind(this),
                    onComplete: (function() {
                        this.onEnteredFullScreen(true)
                    }).jBind(this)
                }));
                this.fullScreenFX.start({
                    width: [this.boxSize.width, t.width],
                    height: [this.boxSize.height, t.height],
                    top: [this.boxBoundaries.top, 0 + s.y],
                    left: [this.boxBoundaries.left, 0 + s.x],
                    opacity: [0, 1]
                })
            }.jBind(this)
        })
    };
    n.prototype.onEnteredFullScreen = function(u) {
        var s, w, v = 0,
            r = 0,
            q = window.parent !== window.window;
        if (u && !this.isFullScreen && !q && !(f.jBrowser.trident && f.jBrowser.backCompat)) {
            this.fullScreenBox.jSetCss({
                display: "block",
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: "auto",
                height: "auto"
            })
        }
        this.isFullScreen = true;
        this.o.firstChild.jSetCss({
            width: "100%",
            height: "auto",
            "max-width": this.fullScreenSize.width,
            "max-height": this.fullScreenSize.height
        });
        this.resizeCallback();
        if (this.firstFullScreenRun) {
            setTimeout((function() {
                i(this.progressBar.textBox).jAppendTo(this.progressBar.barBox).replaceChild(f.doc.createTextNode(this.localString("fullscreen-loading-text")), this.progressBar.textBox.firstChild);
                this.progressBar.box.jAddClass("Image360-loading-box-fs");
                this.preloadImages("fullscreen", this.currentFrame.row + 1, this.currentFrame.col + 1)
            }).jBind(this), 1);
            this.firstFullScreenRun = false
        }
        this.jump_(this.C.row, this.C.col);
        if (this.fullScreenScrollCallback) {
            i(window).jAddEvent("scroll", this.fullScreenScrollCallback)
        }
        if (!this.leaveFSButton) {
            this.leaveFSButton = f.$new("div", {}, {
                zIndex: 20
            }).jAddClass("Image360-button").jAddClass("fullscreen-exit").jAppendTo(this.fullScreenBox).jAddEvent(g.mousedown, function(x) {
                x.stopDistribution()
            }).jAddEvent("click", function(y) {
                var x;
                if (3 == y.getButton()) {
                    return true
                }
                y.stop();
                if (x = this.fullScreenBox.jFetch("fullscreen:pseudo:event:keydown")) {
                    f.doc.jRemoveEvent("keydown", x);
                    this.fullScreenBox.jDel("fullscreen:pseudo:event:keydown")
                }
                this.exitFullscreen();
                return false
            }.jBindAsEvent(this));
            f.jBrowser.touchScreen && this.leaveFSButton.jAddEvent("touchstart", function(x) {
                x.stopDistribution()
            })
        }
        this.leaveFSButton.show();
        if (u) {
            var t = function(x) {
                if (x.keyCode == 27) {
                    f.doc.jRemoveEvent("keydown", t);
                    this.exitFullscreen()
                }
            }.jBindAsEvent(this);
            this.fullScreenBox.jStore("fullscreen:pseudo:event:keydown", t);
            f.doc.jAddEvent("keydown", t);
            !f.jBrowser.touchScreen && (this.leaveFSMessage = new f.Message("Press ESC key to leave full-screen", 4000, this.fullScreenBox, "Image360-message"))
        }
        this.fullscreenIcon.hide()
    };
    n.prototype.exitFullscreen = function() {
        var t = this.fullScreenBox.jGetSize(),
            s = this.fullScreenBox.jGetRect(),
            q = this.checkJumpRowCol(this.C.row, this.C.col);
        this.leaveFSMessage && this.leaveFSMessage.hide(0);
        this._hideM && this._hideM();
        if (t.width / t.height > this.fullScreenSize.width / this.fullScreenSize.height) {
            this.fullScreenImage.jSetCss({
                width: "auto",
                height: "98%",
                "max-height": this.fullScreenSize.height,
                display: "inline-block",
                "vertical-align": "middle"
            })
        } else {
            this.fullScreenImage.jSetCss({
                width: "98%",
                "max-width": this.fullScreenSize.width,
                height: "auto",
                display: "inline-block",
                "vertical-align": "middle"
            })
        }
        if (m.jBrowser.fullScreen.capable && m.jBrowser.fullScreen.enabled()) {
            m.jBrowser.fullScreen.cancel()
        } else {
            this.leaveFSButton.hide();
            this.fullScreenExitFX || (this.fullScreenExitFX = new f.FX(this.fullScreenBox, {
                duration: 300,
                transition: f.FX.Transition.expoOut,
                onStart: (function() {
                    this.isFullScreen = false;
                    this.fullScreenBox.jSetCss({
                        position: "absolute"
                    }).jAppendTo(f.body)
                }).jBind(this),
                onAfterRender: (function(r) {
                    this.o.jSetCss(this.fullScreenImage.jGetSize());
                    this.size = this.o.jGetSize();
                    this.jump_(this.C.row, this.C.col)
                }).jBind(this),
                onComplete: (function() {
                    this.onExitFullScreen(true)
                }).jBind(this)
            }));
            this.fullScreenExitFX.start({
                width: [t.width, this.boxSize.width],
                height: [t.height, this.boxSize.height],
                top: [0 + s.top, this.boxBoundaries.top],
                left: [0 + s.left, this.boxBoundaries.left],
                opacity: [1, 0.5]
            })
        }
    };
    n.prototype.onExitFullScreen = function(q) {
        if (!this.fullScreenBox) {
            return
        }
        this.fullscreenProgressBox && this.fullscreenProgressBox.jRemove() && delete this.fullscreenProgressBox;
        if (this.fullScreenScrollCallback) {
            i(window).jRemoveEvent("scroll", this.fullScreenScrollCallback)
        }
        this.isFullScreen = false;
        this.o.jAppendTo(this.wrapper).jSetOpacity(0).jSetCss({
            width: "",
            height: "",
            "max-height": "",
            "max-width": "100%",
            "z-index": ""
        });
        this.resizeCallback();
        this.leaveFSButton.hide();
        this.fullscreenIcon.show();
        this.o.jSetOpacity(1);
        this.fullScreenBox.hide();
        this.canMagnify = true
    };
    n.prototype.setupHint = function() {
        this.hintBox = f.$new("span", null, {
            position: "absolute",
            "z-index": 999,
            visibility: "hidden"
        }).jAddClass("Image360-hint").jAppendTo(this.o);
        f.$new("span").jAddClass("hint-side").jAddClass("right").jAppendTo(this.hintBox);
        f.$new("span").jAddClass("hint-side").jAddClass("left").jAppendTo(this.hintBox);
        this.hintBox.append(f.$new("span", null, {
            display: "inline-block",
            height: "100%",
            width: 1,
            "vertical-align": "middle"
        }));
        f.$new("span").jSetCss({
            position: "relative",
            margin: "auto",
            display: "inline-block",
            "vertical-align": "middle"
        }).jAddClass("hint-text").append(document.createTextNode(this.localString(f.jBrowser.touchScreen ? "mobile-hint-text" : "hint-text"))).jAppendTo(this.hintBox);
        if (f.jBrowser.ieMode == 5) {
            this.hintBox.jSetCss({
                height: this.hintBox.jGetSize().height
            })
        }
        this.hintBox.show();
        if (this.op("mousewheel-step") > 0) {
            var q = function(s) {
                this.o.jRemoveEvent("mousescroll", q);
                this.hideHintBox()
            }.jBindAsEvent(this);
            this.o.jAddEvent("mousescroll", q)
        }
        if ("hover" === this.op("spin")) {
            var r = function() {
                this.hideHintBox();
                this.o.jRemoveEvent("mousemove", r)
            }.jBindAsEvent(this);
            this.o.jAddEvent("mousemove", r)
        }
    };
    n.prototype.hideHintBox = function() {
        if (!this.hintBox || this.hintBox.hidding) {
            return
        }
        this.hintBox.hidding = true;
        new f.FX(this.hintBox, {
            duration: 200,
            onComplete: function() {
                this.hintBox.jRemove();
                delete this.hintBox
            }.jBind(this)
        }).start({
            opacity: [this.hintBox.jGetCss("opacity"), 0]
        })
    };
    n.prototype.getCurrentFrame = function() {
        var q = this.checkJumpRowCol(this.C.row, this.C.col);
        q.row++;
        q.col++;
        return q
    };
    var j = {
        version: "v4.5.14",
        tools: i([]),
        options: {},
        lang: {},
        callbacks: {},
        start: function(r) {
            var q = null;
            f.$A((r ? [i(r)] : document.byTag("a"))).jEach((function(s) {
                if (i(s) && i(s).jHasClass("Image360")) {
                    !j.tools.filter(function(t) {
                        return t.o === s
                    }).length && j.tools.push(q = new n(s))
                }
            }).jBind(this));
            return q
        },
        stop: function(u) {
            var r, s, q;
            if (u) {
                (s = a(u)) && (s = j.tools.splice(j.tools.indexOf(s), 1)) && s[0].stop() && (delete s[0]);
                return
            }
            while (r = j.tools.length) {
                s = j.tools.splice(r - 1, 1);
                s[0].stop();
                delete s[0]
            }
        },
        spin: function(s, r) {
            var q;
            (q = a(s)) && q.spin(r)
        },
        jump: function(s, r) {
            var q = null;
            if (q = a(s)) {
                q._hideM && q._hideM();
                q.hintBox && q.hideHintBox();
                q.jump(q.C.row + r, q.C.col)
            }
        },
        pause: function(r) {
            var q;
            (q = a(r)) && q._A.pause()
        },
        magnifyOn: function(r) {
            var q;
            (q = a(r)) && q.magnify(true)
        },
        magnifyOff: function(r) {
            var q;
            (q = a(r)) && q.magnify(false)
        },
        fullscreen: function(r) {
            var q;
            (q = a(r)) && q.enterFullscreen()
        },
        getCurrentFrame: function(s) {
            var q, r = null;
            if (q = a(s)) {
                r = q.getCurrentFrame();
                r.column = r.col;
                delete r.col
            }
            return r
        },
        registerCallback: function(q, r) {
            j.callbacks[q] = r
        }
    };

    function a(s) {
        var r = [],
            q = null;
        (s && (q = i(s))) && (r = j.tools.filter(function(t) {
            return t.o === q
        }));
        return r.length ? r[0] : null
    }
    i(document).jAddEvent("domready", function() {
        f.addCSS(".Image360", {
            padding: "0 !important",
            outline: "0 !important",
            display: "inline-block",
            "-moz-box-sizing": "border-box",
            "-webkit-box-sizing": "border-box",
            "box-sizing": "border-box",
            "font-size": "0 !important",
            "line-height": "100% !important",
            "max-width": "100%",
            "-webkit-transition": "none !important",
            "-moz-transition": "none !important",
            "-o-transition": "none !important",
            transition: "none !important"
        }, "image360-css");
        f.addCSS(".Image360 img", {
            border: "0 !important",
            padding: "0 !important",
            margin: "0 !important",
            height: "auto"
        }, "image360-css");
        f.addCSS(".Image360 > img", {
            width: "100%"
        }, "image360-css");
        8 === f.jBrowser.ieMode && f.addCSS(".ie8-image .Image360 > img", {
            "max-width": "none !important"
        }, "image360-css");
        7 === f.jBrowser.ieMode && f.addCSS(".ie7-image .Image360 > img", {
            width: "auto !important"
        }, "image360-css");
        5 === f.jBrowser.ieMode && f.addCSS(".ie5-image .ImageZoom img", {
            width: "auto !important"
        }, "image360-css");
        f.addCSS(".Image360-box", {
            "text-align": "center !important;"
        }, "image360-css");
        f.addCSS(".Image360-box:after", {
            content: '""',
            display: "inline-block",
            "vertical-align": "middle"
        }, "image360-css");
        f.addCSS(".Image360-box .Image360", {
            display: "inline-block !important",
            "vertical-align": "middle"
        }, "image360-css");
        f.addCSS(".image-temporary-img img", {
            "max-height": "none !important",
            "max-width": "none !important"
        }, "image360-css");
        j.start()
    });
    return j
})();