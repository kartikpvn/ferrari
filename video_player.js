// EventListener | MIT/GPL2 | github.com/jonathantneal/EventListener

this.Element &&
  Element.prototype.attachEvent &&
  !Element.prototype.addEventListener &&
  (function() {
    function addToPrototype(name, method) {
      Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[
        name
      ] = method;
    }

    // add
    addToPrototype("addEventListener", function(type, listener) {
      var target = this,
        listeners = (target.addEventListener.listeners =
          target.addEventListener.listeners || {}),
        typeListeners = (listeners[type] = listeners[type] || []);

      // if no events exist, attach the listener
      if (!typeListeners.length) {
        target.attachEvent(
          "on" + type,
          (typeListeners.event = function(event) {
            var documentElement = (target.document &&
              target.document.documentElement) ||
              target.documentElement || { scrollLeft: 0, scrollTop: 0 };

            // polyfill w3c properties and methods
            event.currentTarget = target;
            event.pageX = event.clientX + documentElement.scrollLeft;
            event.pageY = event.clientY + documentElement.scrollTop;
            event.preventDefault = function() {
              event.returnValue = false;
            };
            event.relatedTarget = event.fromElement || null;
            event.stopImmediatePropagation = function() {
              immediatePropagation = false;
              event.cancelBubble = true;
            };
            event.stopPropagation = function() {
              event.cancelBubble = true;
            };
            event.target = event.srcElement || target;
            event.timeStamp = +new Date();

            // create an cached list of the master events list (to protect this loop from breaking when an event is removed)
            for (
              var i = 0,
                typeListenersCache = [].concat(typeListeners),
                typeListenerCache,
                immediatePropagation = true;
              immediatePropagation &&
              (typeListenerCache = typeListenersCache[i]);
              ++i
            ) {
              // check to see if the cached event still exists in the master events list
              for (
                var ii = 0, typeListener;
                (typeListener = typeListeners[ii]);
                ++ii
              ) {
                if (typeListener == typeListenerCache) {
                  typeListener.call(target, event);

                  break;
                }
              }
            }
          })
        );
      }

      // add the event to the master event list
      typeListeners.push(listener);
    });

    // remove
    addToPrototype("removeEventListener", function(type, listener) {
      var target = this,
        listeners = (target.addEventListener.listeners =
          target.addEventListener.listeners || {}),
        typeListeners = (listeners[type] = listeners[type] || []);

      // remove the newest matching event from the master event list
      for (
        var i = typeListeners.length - 1, typeListener;
        (typeListener = typeListeners[i]);
        --i
      ) {
        if (typeListener == listener) {
          typeListeners.splice(i, 1);

          break;
        }
      }

      // if no events exist, detach the listener
      if (!typeListeners.length && typeListeners.event) {
        target.detachEvent("on" + type, typeListeners.event);
      }
    });

    // dispatch
    addToPrototype("dispatchEvent", function(eventObject) {
      var target = this,
        type = eventObject.type,
        listeners = (target.addEventListener.listeners =
          target.addEventListener.listeners || {}),
        typeListeners = (listeners[type] = listeners[type] || []);

      try {
        return target.fireEvent("on" + type, eventObject);
      } catch (error) {
        if (typeListeners.event) {
          typeListeners.event(eventObject);
        }

        return;
      }
    });

    // CustomEvent
    Object.defineProperty(Window.prototype, "CustomEvent", {
      get: function() {
        var self = this;

        return function CustomEvent(type, eventInitDict) {
          var event = self.document.createEventObject(),
            key;

          event.type = type;
          for (key in eventInitDict) {
            if (key == "cancelable") {
              event.returnValue = !eventInitDict.cancelable;
            } else if (key == "bubbles") {
              event.cancelBubble = !eventInitDict.bubbles;
            } else if (key == "detail") {
              event.detail = eventInitDict.detail;
            }
          }
          return event;
        };
      }
    });

    // ready
    function ready(event) {
      if (ready.interval && document.body) {
        ready.interval = clearInterval(ready.interval);

        document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
      }
    }

    ready.interval = setInterval(ready, 1);

    window.addEventListener("load", ready);
  })();


/*!
 * H5VF
 * HTML5 Video Framework
 * http://sarasoueidan.com/h5vf
 * @author Sara Soueidan
 * @version 1.0.0
 * Copyright 2013. MIT licensed.
 */
(function($, window, document, undefined) {
  "use strict";

  $(function() {
    var video = document.getElementById("myvideo"),
      container = document.getElementById("custom-video"),
      playbutton = document.getElementById("playpause"),
      mutebutton = document.getElementById("mute"),
      fullscreenbutton = document.getElementById("fullscreen"),
      seek = document.getElementById("seekbar"),
      volume = document.getElementById("volumebar"),
      vval = volume.value,
      progressbar = document.getElementById("progressbar"),
      bufferbar = document.getElementById("bufferbar");

    if (video.autoplay) {
      playbutton.classList.add("icon-pause");
      playbutton.classList.remove("icon-play");
    }
    video.addEventListener(
      "playing",
      function() {
        seek.classList.add("light");
      },
      false
    );

    if (video.muted) {
      mutebutton.classList.add("icon-volume");
      mutebutton.classList.remove("icon-volume-2");
      volume.value = 0;
    } else {
      mutebutton.classList.add("icon-volume-2");
      mutebutton.classList.remove("icon-volume");
    }

    function playpause() {
      if (video.paused) {
        video.play();
        playbutton.classList.add("icon-pause");
        playbutton.classList.remove("icon-play");
        seek.classList.add("light");
      } else {
        video.pause();
        playbutton.classList.add("icon-play");
        playbutton.classList.remove("icon-pause");
        seek.classList.remove("light");
      }
    }

    playbutton.addEventListener("click", playpause, false);
    video.addEventListener("click", playpause, false);

    mutebutton.addEventListener(
      "click",
      function() {
        if (video.muted) {
          video.muted = false;
          mutebutton.classList.add("icon-volume-2");
          mutebutton.classList.remove("icon-volume");
          volume.value = vval;
        } else {
          video.muted = true;
          volume.value = 0;
          mutebutton.classList.add("icon-volume");
          mutebutton.classList.remove("icon-volume-2");
        }
      },
      false
    );

    var isFullscreen = false;
    fullscreenbutton.addEventListener(
      "click",
      function() {
        if (!isFullscreen) {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.mozRequestFullScreen) {
            container.mozRequestFullScreen(); // Firefox
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Chrome and Safari
          }
          isFullscreen = true;
          fullscreenbutton.classList.remove("icon-fullscreen-alt");
          fullscreenbutton.classList.add("icon-fullscreen-exit-alt");
        } else {
          if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
          isFullscreen = false;
          fullscreenbutton.classList.add("icon-fullscreen-alt");
          fullscreenbutton.classList.remove("icon-fullscreen-exit-alt");
        }
      },
      false
    );

    //change video time when seek changes
    seek.addEventListener(
      "change",
      function() {
        var time = video.duration * (seek.value / 100);
        video.currentTime = time;
      },
      false
    );

    seek.addEventListener(
      "mousedown",
      function() {
        video.pause();
      },
      false
    );
    seek.addEventListener(
      "mouseup",
      function() {
        video.play();
        //if the user plays the video without clicking play, by starting directly with specifying a point of time on the seekbar, make sure the play button becomes a pause button
        playbutton.classList.remove("icon-play");
        playbutton.classList.add("icon-pause");
      },
      false
    );

    //update progress bar as video plays
    video.addEventListener(
      "timeupdate",
      function() {
        var percent = Math.floor(100 / video.duration * video.currentTime);
        progressbar.value = percent;
        progressbar.getElementsByTagName("span")[0].innerHTML = percent;
      },
      false
    );

    //change seek position as video plays
    video.addEventListener(
      "timeupdate",
      function() {
        var value = 100 / video.duration * video.currentTime;
        seek.value = value;
      },
      false
    );

    volume.addEventListener(
      "change",
      function() {
        video.volume = this.value;
        vval = this.value;
        if (this.value === 0) {
          video.muted = true;
          mutebutton.classList.add("icon-volume");
          mutebutton.classList.remove("icon-volume-2");
        } else if (this.value !== 0) {
          video.muted = false;
          mutebutton.classList.add("icon-volume-2");
          mutebutton.classList.remove("icon-volume");
        }
      },
      false
    );

    video.addEventListener("ended", function() {
      video.pause();
      video.currentTime = 0;
      playbutton.classList.add("icon-play");
      playbutton.classList.remove("icon-pause");
      seek.classList.remove("light");
    });
  });
})(jQuery, window, document);
