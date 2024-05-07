(() => {
  // output/Control.Apply/foreign.js
  var arrayApply = function(fs) {
    return function(xs) {
      var l = fs.length;
      var k = xs.length;
      var result = new Array(l * k);
      var n = 0;
      for (var i2 = 0; i2 < l; i2++) {
        var f = fs[i2];
        for (var j = 0; j < k; j++) {
          result[n++] = f(xs[j]);
        }
      }
      return result;
    };
  };

  // output/Control.Semigroupoid/index.js
  var semigroupoidFn = {
    compose: function(f) {
      return function(g) {
        return function(x) {
          return f(g(x));
        };
      };
    }
  };

  // output/Control.Category/index.js
  var identity = function(dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function(x) {
      return x;
    },
    Semigroupoid0: function() {
      return semigroupoidFn;
    }
  };

  // output/Data.Boolean/index.js
  var otherwise = true;

  // output/Data.Function/index.js
  var flip = function(f) {
    return function(b2) {
      return function(a2) {
        return f(a2)(b2);
      };
    };
  };
  var $$const = function(a2) {
    return function(v) {
      return a2;
    };
  };

  // output/Data.Functor/foreign.js
  var arrayMap = function(f) {
    return function(arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i2 = 0; i2 < l; i2++) {
        result[i2] = f(arr[i2]);
      }
      return result;
    };
  };

  // output/Data.Unit/foreign.js
  var unit = void 0;

  // output/Type.Proxy/index.js
  var $$Proxy = /* @__PURE__ */ function() {
    function $$Proxy2() {
    }
    ;
    $$Proxy2.value = new $$Proxy2();
    return $$Proxy2;
  }();

  // output/Data.Functor/index.js
  var map = function(dict) {
    return dict.map;
  };
  var mapFlipped = function(dictFunctor) {
    var map112 = map(dictFunctor);
    return function(fa) {
      return function(f) {
        return map112(f)(fa);
      };
    };
  };
  var $$void = function(dictFunctor) {
    return map(dictFunctor)($$const(unit));
  };
  var voidLeft = function(dictFunctor) {
    var map112 = map(dictFunctor);
    return function(f) {
      return function(x) {
        return map112($$const(x))(f);
      };
    };
  };
  var functorArray = {
    map: arrayMap
  };

  // output/Control.Apply/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var applyArray = {
    apply: arrayApply,
    Functor0: function() {
      return functorArray;
    }
  };
  var apply = function(dict) {
    return dict.apply;
  };
  var applySecond = function(dictApply) {
    var apply1 = apply(dictApply);
    var map29 = map(dictApply.Functor0());
    return function(a2) {
      return function(b2) {
        return apply1(map29($$const(identity2))(a2))(b2);
      };
    };
  };
  var lift2 = function(dictApply) {
    var apply1 = apply(dictApply);
    var map29 = map(dictApply.Functor0());
    return function(f) {
      return function(a2) {
        return function(b2) {
          return apply1(map29(f)(a2))(b2);
        };
      };
    };
  };

  // output/Control.Applicative/index.js
  var pure = function(dict) {
    return dict.pure;
  };
  var unless = function(dictApplicative) {
    var pure110 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (!v) {
          return v1;
        }
        ;
        if (v) {
          return pure110(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 68, column 1 - line 68, column 65): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var when = function(dictApplicative) {
    var pure110 = pure(dictApplicative);
    return function(v) {
      return function(v1) {
        if (v) {
          return v1;
        }
        ;
        if (!v) {
          return pure110(unit);
        }
        ;
        throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
  var liftA1 = function(dictApplicative) {
    var apply2 = apply(dictApplicative.Apply0());
    var pure110 = pure(dictApplicative);
    return function(f) {
      return function(a2) {
        return apply2(pure110(f))(a2);
      };
    };
  };
  var applicativeArray = {
    pure: function(x) {
      return [x];
    },
    Apply0: function() {
      return applyArray;
    }
  };

  // output/Control.Bind/index.js
  var discard = function(dict) {
    return dict.discard;
  };
  var bind = function(dict) {
    return dict.bind;
  };
  var bindFlipped = function(dictBind) {
    return flip(bind(dictBind));
  };
  var composeKleisliFlipped = function(dictBind) {
    var bindFlipped12 = bindFlipped(dictBind);
    return function(f) {
      return function(g) {
        return function(a2) {
          return bindFlipped12(f)(g(a2));
        };
      };
    };
  };
  var composeKleisli = function(dictBind) {
    var bind15 = bind(dictBind);
    return function(f) {
      return function(g) {
        return function(a2) {
          return bind15(f(a2))(g);
        };
      };
    };
  };
  var discardUnit = {
    discard: function(dictBind) {
      return bind(dictBind);
    }
  };

  // output/Effect.Aff/foreign.js
  var Aff = function() {
    var EMPTY = {};
    var PURE = "Pure";
    var THROW = "Throw";
    var CATCH = "Catch";
    var SYNC = "Sync";
    var ASYNC = "Async";
    var BIND = "Bind";
    var BRACKET = "Bracket";
    var FORK = "Fork";
    var SEQ = "Sequential";
    var MAP = "Map";
    var APPLY = "Apply";
    var ALT = "Alt";
    var CONS = "Cons";
    var RESUME = "Resume";
    var RELEASE = "Release";
    var FINALIZER = "Finalizer";
    var FINALIZED = "Finalized";
    var FORKED = "Forked";
    var FIBER = "Fiber";
    var THUNK = "Thunk";
    function Aff2(tag, _1, _2, _3) {
      this.tag = tag;
      this._1 = _1;
      this._2 = _2;
      this._3 = _3;
    }
    function AffCtr(tag) {
      var fn = function(_1, _2, _3) {
        return new Aff2(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }
    function nonCanceler2(error4) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error4) {
        setTimeout(function() {
          throw error4;
        }, 0);
      }
    }
    function runSync(left3, right3, eff) {
      try {
        return right3(eff());
      } catch (error4) {
        return left3(error4);
      }
    }
    function runAsync(left3, eff, k) {
      try {
        return eff(k)();
      } catch (error4) {
        k(left3(error4))();
        return nonCanceler2;
      }
    }
    var Scheduler = function() {
      var limit = 1024;
      var size4 = 0;
      var ix = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk;
        draining = true;
        while (size4 !== 0) {
          size4--;
          thunk = queue[ix];
          queue[ix] = void 0;
          ix = (ix + 1) % limit;
          thunk();
        }
        draining = false;
      }
      return {
        isDraining: function() {
          return draining;
        },
        enqueue: function(cb) {
          var i2, tmp;
          if (size4 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix + size4) % limit] = cb;
          size4++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util2) {
      var fibers = {};
      var fiberId = 0;
      var count = 0;
      return {
        register: function(fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function(result) {
              return function() {
                count--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function() {
          return count === 0;
        },
        killAll: function(killError, cb) {
          return function() {
            if (count === 0) {
              return cb();
            }
            var killCount = 0;
            var kills = {};
            function kill2(fid) {
              kills[fid] = fibers[fid].kill(killError, function(result) {
                return function() {
                  delete kills[fid];
                  killCount--;
                  if (util2.isLeft(result) && util2.fromLeft(result)) {
                    setTimeout(function() {
                      throw util2.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }
            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill2(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count = 0;
            return function(error4) {
              return new Aff2(SYNC, function() {
                for (var k2 in kills) {
                  if (kills.hasOwnProperty(k2)) {
                    kills[k2]();
                  }
                }
              });
            };
          };
        }
      };
    }
    var SUSPENDED = 0;
    var CONTINUE = 1;
    var STEP_BIND = 2;
    var STEP_RESULT = 3;
    var PENDING = 4;
    var RETURN = 5;
    var COMPLETED = 6;
    function Fiber(util2, supervisor, aff) {
      var runTick = 0;
      var status = SUSPENDED;
      var step3 = aff;
      var fail2 = null;
      var interrupt = null;
      var bhead = null;
      var btail = null;
      var attempts = null;
      var bracketCount = 0;
      var joinId = 0;
      var joins = null;
      var rethrow = true;
      function run3(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp = null;
          result = null;
          attempt = null;
          switch (status) {
            case STEP_BIND:
              status = CONTINUE;
              try {
                step3 = bhead(step3);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail2 = util2.left(e);
                step3 = null;
              }
              break;
            case STEP_RESULT:
              if (util2.isLeft(step3)) {
                status = RETURN;
                fail2 = step3;
                step3 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step3 = util2.fromRight(step3);
              }
              break;
            case CONTINUE:
              switch (step3.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step3._2;
                  status = CONTINUE;
                  step3 = step3._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step3 = util2.right(step3._1);
                  } else {
                    status = STEP_BIND;
                    step3 = step3._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step3 = runSync(util2.left, util2.right, step3._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step3 = runAsync(util2.left, step3._1, function(result2) {
                    return function() {
                      if (runTick !== localRunTick) {
                        return;
                      }
                      runTick++;
                      Scheduler.enqueue(function() {
                        if (runTick !== localRunTick + 1) {
                          return;
                        }
                        status = STEP_RESULT;
                        step3 = result2;
                        run3(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail2 = util2.left(step3._1);
                  step3 = null;
                  break;
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step3, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step3, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step3 = step3._1;
                  break;
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step3, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step3, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step3 = step3._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util2, supervisor, step3._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step3._1) {
                    tmp.run();
                  }
                  step3 = util2.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step3 = sequential3(util2, supervisor, step3._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step3 = interrupt || fail2 || step3;
              } else {
                tmp = attempts._3;
                attempt = attempts._1;
                attempts = attempts._2;
                switch (attempt.tag) {
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail2) {
                      status = CONTINUE;
                      step3 = attempt._2(util2.fromLeft(fail2));
                      fail2 = null;
                    }
                    break;
                  case RESUME:
                    if (interrupt && interrupt !== tmp && bracketCount === 0 || fail2) {
                      status = RETURN;
                    } else {
                      bhead = attempt._1;
                      btail = attempt._2;
                      status = STEP_BIND;
                      step3 = util2.fromRight(step3);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail2 === null) {
                      result = util2.fromRight(step3);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step3 = attempt._3(result);
                      }
                    }
                    break;
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step3, fail2), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step3 = attempt._1.killed(util2.fromLeft(interrupt))(attempt._2);
                    } else if (fail2) {
                      step3 = attempt._1.failed(util2.fromLeft(fail2))(attempt._2);
                    } else {
                      step3 = attempt._1.completed(util2.fromRight(step3))(attempt._2);
                    }
                    fail2 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step3, fail2), attempts, interrupt);
                    status = CONTINUE;
                    step3 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step3 = attempt._1;
                    fail2 = attempt._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step3));
                }
              }
              joins = null;
              if (interrupt && fail2) {
                setTimeout(function() {
                  throw util2.fromLeft(fail2);
                }, 0);
              } else if (util2.isLeft(step3) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util2.fromLeft(step3);
                  }
                }, 0);
              }
              return;
            case SUSPENDED:
              status = CONTINUE;
              break;
            case PENDING:
              return;
          }
        }
      }
      function onComplete(join4) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join4.rethrow;
            join4.handler(step3)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join4;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill2(error4, cb) {
        return function() {
          if (status === COMPLETED) {
            cb(util2.right(void 0))();
            return function() {
            };
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function() {
              return cb(util2.right(void 0));
            }
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util2.left(error4);
              status = COMPLETED;
              step3 = interrupt;
              run3(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util2.left(error4);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step3(error4)), attempts, interrupt);
                }
                status = RETURN;
                step3 = null;
                fail2 = null;
                run3(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util2.left(error4);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step3 = null;
                fail2 = null;
              }
          }
          return canceler;
        };
      }
      function join3(cb) {
        return function() {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run3(runTick);
          }
          return canceler;
        };
      }
      return {
        kill: kill2,
        join: join3,
        onComplete,
        isSuspended: function() {
          return status === SUSPENDED;
        },
        run: function() {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function() {
                run3(runTick);
              });
            } else {
              run3(runTick);
            }
          }
        }
      };
    }
    function runPar(util2, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root = EMPTY;
      function kill2(error4, par2, cb2) {
        var step3 = par2;
        var head2 = null;
        var tail = null;
        var count = 0;
        var kills2 = {};
        var tmp, kid;
        loop:
          while (true) {
            tmp = null;
            switch (step3.tag) {
              case FORKED:
                if (step3._3 === EMPTY) {
                  tmp = fibers[step3._1];
                  kills2[count++] = tmp.kill(error4, function(result) {
                    return function() {
                      count--;
                      if (count === 0) {
                        cb2(result)();
                      }
                    };
                  });
                }
                if (head2 === null) {
                  break loop;
                }
                step3 = head2._2;
                if (tail === null) {
                  head2 = null;
                } else {
                  head2 = tail._1;
                  tail = tail._2;
                }
                break;
              case MAP:
                step3 = step3._2;
                break;
              case APPLY:
              case ALT:
                if (head2) {
                  tail = new Aff2(CONS, head2, tail);
                }
                head2 = step3;
                step3 = step3._1;
                break;
            }
          }
        if (count === 0) {
          cb2(util2.right(void 0))();
        } else {
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join3(result, head2, tail) {
        var fail2, step3, lhs, rhs, tmp, kid;
        if (util2.isLeft(result)) {
          fail2 = result;
          step3 = null;
        } else {
          step3 = result;
          fail2 = null;
        }
        loop:
          while (true) {
            lhs = null;
            rhs = null;
            tmp = null;
            kid = null;
            if (interrupt !== null) {
              return;
            }
            if (head2 === null) {
              cb(fail2 || step3)();
              return;
            }
            if (head2._3 !== EMPTY) {
              return;
            }
            switch (head2.tag) {
              case MAP:
                if (fail2 === null) {
                  head2._3 = util2.right(head2._1(util2.fromRight(step3)));
                  step3 = head2._3;
                } else {
                  head2._3 = fail2;
                }
                break;
              case APPLY:
                lhs = head2._1._3;
                rhs = head2._2._3;
                if (fail2) {
                  head2._3 = fail2;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill2(early, fail2 === lhs ? head2._2 : head2._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail === null) {
                        join3(fail2, null, null);
                      } else {
                        join3(fail2, tail._1, tail._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                } else if (lhs === EMPTY || rhs === EMPTY) {
                  return;
                } else {
                  step3 = util2.right(util2.fromRight(lhs)(util2.fromRight(rhs)));
                  head2._3 = step3;
                }
                break;
              case ALT:
                lhs = head2._1._3;
                rhs = head2._2._3;
                if (lhs === EMPTY && util2.isLeft(rhs) || rhs === EMPTY && util2.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util2.isLeft(lhs) && rhs !== EMPTY && util2.isLeft(rhs)) {
                  fail2 = step3 === lhs ? rhs : lhs;
                  step3 = null;
                  head2._3 = fail2;
                } else {
                  head2._3 = step3;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill2(early, step3 === lhs ? head2._2 : head2._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail === null) {
                        join3(step3, null, null);
                      } else {
                        join3(step3, tail._1, tail._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                }
                break;
            }
            if (tail === null) {
              head2 = null;
            } else {
              head2 = tail._1;
              tail = tail._2;
            }
          }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join3(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run3() {
        var status = CONTINUE;
        var step3 = par;
        var head2 = null;
        var tail = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step3.tag) {
                  case MAP:
                    if (head2) {
                      tail = new Aff2(CONS, head2, tail);
                    }
                    head2 = new Aff2(MAP, step3._1, EMPTY, EMPTY);
                    step3 = step3._2;
                    break;
                  case APPLY:
                    if (head2) {
                      tail = new Aff2(CONS, head2, tail);
                    }
                    head2 = new Aff2(APPLY, EMPTY, step3._2, EMPTY);
                    step3 = step3._1;
                    break;
                  case ALT:
                    if (head2) {
                      tail = new Aff2(CONS, head2, tail);
                    }
                    head2 = new Aff2(ALT, EMPTY, step3._2, EMPTY);
                    step3 = step3._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step3;
                    step3 = new Aff2(FORKED, fid, new Aff2(CONS, head2, tail), EMPTY);
                    tmp = Fiber(util2, supervisor, tmp);
                    tmp.onComplete({
                      rethrow: false,
                      handler: resolve(step3)
                    })();
                    fibers[fid] = tmp;
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                }
                break;
              case RETURN:
                if (head2 === null) {
                  break loop;
                }
                if (head2._1 === EMPTY) {
                  head2._1 = step3;
                  status = CONTINUE;
                  step3 = head2._2;
                  head2._2 = EMPTY;
                } else {
                  head2._2 = step3;
                  step3 = head2;
                  if (tail === null) {
                    head2 = null;
                  } else {
                    head2 = tail._1;
                    tail = tail._2;
                  }
                }
            }
          }
        root = step3;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error4, cb2) {
        interrupt = util2.left(error4);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }
        kills = null;
        var newKills = kill2(error4, root, cb2);
        return function(killError) {
          return new Aff2(ASYNC, function(killCb) {
            return function() {
              for (var kid2 in newKills) {
                if (newKills.hasOwnProperty(kid2)) {
                  newKills[kid2]();
                }
              }
              return nonCanceler2;
            };
          });
        };
      }
      run3();
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            return cancel(killError, killCb);
          };
        });
      };
    }
    function sequential3(util2, supervisor, par) {
      return new Aff2(ASYNC, function(cb) {
        return function() {
          return runPar(util2, supervisor, par, cb);
        };
      });
    }
    Aff2.EMPTY = EMPTY;
    Aff2.Pure = AffCtr(PURE);
    Aff2.Throw = AffCtr(THROW);
    Aff2.Catch = AffCtr(CATCH);
    Aff2.Sync = AffCtr(SYNC);
    Aff2.Async = AffCtr(ASYNC);
    Aff2.Bind = AffCtr(BIND);
    Aff2.Bracket = AffCtr(BRACKET);
    Aff2.Fork = AffCtr(FORK);
    Aff2.Seq = AffCtr(SEQ);
    Aff2.ParMap = AffCtr(MAP);
    Aff2.ParApply = AffCtr(APPLY);
    Aff2.ParAlt = AffCtr(ALT);
    Aff2.Fiber = Fiber;
    Aff2.Supervisor = Supervisor;
    Aff2.Scheduler = Scheduler;
    Aff2.nonCanceler = nonCanceler2;
    return Aff2;
  }();
  var _pure = Aff.Pure;
  var _throwError = Aff.Throw;
  function _catchError(aff) {
    return function(k) {
      return Aff.Catch(aff, k);
    };
  }
  function _map(f) {
    return function(aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function(value12) {
          return Aff.Pure(f(value12));
        });
      }
    };
  }
  function _bind(aff) {
    return function(k) {
      return Aff.Bind(aff, k);
    };
  }
  function _fork(immediate) {
    return function(aff) {
      return Aff.Fork(immediate, aff);
    };
  }
  var _liftEffect = Aff.Sync;
  function _parAffMap(f) {
    return function(aff) {
      return Aff.ParMap(f, aff);
    };
  }
  function _parAffApply(aff1) {
    return function(aff2) {
      return Aff.ParApply(aff1, aff2);
    };
  }
  var makeAff = Aff.Async;
  function generalBracket(acquire) {
    return function(options2) {
      return function(k) {
        return Aff.Bracket(acquire, options2, k);
      };
    };
  }
  function _makeFiber(util2, aff) {
    return function() {
      return Aff.Fiber(util2, null, aff);
    };
  }
  var _sequential = Aff.Seq;

  // output/Control.Monad/index.js
  var unlessM = function(dictMonad) {
    var bind9 = bind(dictMonad.Bind1());
    var unless2 = unless(dictMonad.Applicative0());
    return function(mb) {
      return function(m) {
        return bind9(mb)(function(b2) {
          return unless2(b2)(m);
        });
      };
    };
  };
  var ap = function(dictMonad) {
    var bind9 = bind(dictMonad.Bind1());
    var pure21 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a2) {
        return bind9(f)(function(f$prime) {
          return bind9(a2)(function(a$prime) {
            return pure21(f$prime(a$prime));
          });
        });
      };
    };
  };

  // output/Data.Semigroup/foreign.js
  var concatString = function(s1) {
    return function(s2) {
      return s1 + s2;
    };
  };
  var concatArray = function(xs) {
    return function(ys) {
      if (xs.length === 0)
        return ys;
      if (ys.length === 0)
        return xs;
      return xs.concat(ys);
    };
  };

  // output/Data.Symbol/index.js
  var reflectSymbol = function(dict) {
    return dict.reflectSymbol;
  };

  // output/Record.Unsafe/foreign.js
  var unsafeGet = function(label5) {
    return function(rec) {
      return rec[label5];
    };
  };
  var unsafeSet = function(label5) {
    return function(value12) {
      return function(rec) {
        var copy2 = {};
        for (var key in rec) {
          if ({}.hasOwnProperty.call(rec, key)) {
            copy2[key] = rec[key];
          }
        }
        copy2[label5] = value12;
        return copy2;
      };
    };
  };

  // output/Data.Semigroup/index.js
  var semigroupString = {
    append: concatString
  };
  var semigroupArray = {
    append: concatArray
  };
  var append = function(dict) {
    return dict.append;
  };

  // output/Data.Bounded/foreign.js
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq4) {
      return function(gt) {
        return function(x) {
          return function(y) {
            return x < y ? lt : x === y ? eq4 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordStringImpl = unsafeCompareImpl;

  // output/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqIntImpl = refEq;
  var eqStringImpl = refEq;

  // output/Data.Eq/index.js
  var eqUnit = {
    eq: function(v) {
      return function(v1) {
        return true;
      };
    }
  };
  var eqString = {
    eq: eqStringImpl
  };
  var eqInt = {
    eq: eqIntImpl
  };
  var eq = function(dict) {
    return dict.eq;
  };

  // output/Data.Ordering/index.js
  var LT = /* @__PURE__ */ function() {
    function LT2() {
    }
    ;
    LT2.value = new LT2();
    return LT2;
  }();
  var GT = /* @__PURE__ */ function() {
    function GT2() {
    }
    ;
    GT2.value = new GT2();
    return GT2;
  }();
  var EQ = /* @__PURE__ */ function() {
    function EQ2() {
    }
    ;
    EQ2.value = new EQ2();
    return EQ2;
  }();

  // output/Data.Ord/index.js
  var ordUnit = {
    compare: function(v) {
      return function(v1) {
        return EQ.value;
      };
    },
    Eq0: function() {
      return eqUnit;
    }
  };
  var ordString = /* @__PURE__ */ function() {
    return {
      compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqString;
      }
    };
  }();
  var ordInt = /* @__PURE__ */ function() {
    return {
      compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqInt;
      }
    };
  }();
  var compare = function(dict) {
    return dict.compare;
  };

  // output/Data.Show/foreign.js
  var showIntImpl = function(n) {
    return n.toString();
  };
  var showStringImpl = function(s) {
    var l = s.length;
    return '"' + s.replace(
      /[\0-\x1F\x7F"\\]/g,
      // eslint-disable-line no-control-regex
      function(c, i2) {
        switch (c) {
          case '"':
          case "\\":
            return "\\" + c;
          case "\x07":
            return "\\a";
          case "\b":
            return "\\b";
          case "\f":
            return "\\f";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "	":
            return "\\t";
          case "\v":
            return "\\v";
        }
        var k = i2 + 1;
        var empty8 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty8;
      }
    ) + '"';
  };
  var showArrayImpl = function(f) {
    return function(xs) {
      var ss = [];
      for (var i2 = 0, l = xs.length; i2 < l; i2++) {
        ss[i2] = f(xs[i2]);
      }
      return "[" + ss.join(",") + "]";
    };
  };

  // output/Data.Show/index.js
  var showString = {
    show: showStringImpl
  };
  var showRecordFields = function(dict) {
    return dict.showRecordFields;
  };
  var showRecord = function() {
    return function() {
      return function(dictShowRecordFields) {
        var showRecordFields1 = showRecordFields(dictShowRecordFields);
        return {
          show: function(record) {
            return "{" + (showRecordFields1($$Proxy.value)(record) + "}");
          }
        };
      };
    };
  };
  var showInt = {
    show: showIntImpl
  };
  var showBoolean = {
    show: function(v) {
      if (v) {
        return "true";
      }
      ;
      if (!v) {
        return "false";
      }
      ;
      throw new Error("Failed pattern match at Data.Show (line 29, column 1 - line 31, column 23): " + [v.constructor.name]);
    }
  };
  var show = function(dict) {
    return dict.show;
  };
  var showArray = function(dictShow) {
    return {
      show: showArrayImpl(show(dictShow))
    };
  };
  var showRecordFieldsCons = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(dictShowRecordFields) {
      var showRecordFields1 = showRecordFields(dictShowRecordFields);
      return function(dictShow) {
        var show14 = show(dictShow);
        return {
          showRecordFields: function(v) {
            return function(record) {
              var tail = showRecordFields1($$Proxy.value)(record);
              var key = reflectSymbol2($$Proxy.value);
              var focus3 = unsafeGet(key)(record);
              return " " + (key + (": " + (show14(focus3) + ("," + tail))));
            };
          }
        };
      };
    };
  };
  var showRecordFieldsConsNil = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(dictShow) {
      var show14 = show(dictShow);
      return {
        showRecordFields: function(v) {
          return function(record) {
            var key = reflectSymbol2($$Proxy.value);
            var focus3 = unsafeGet(key)(record);
            return " " + (key + (": " + (show14(focus3) + " ")));
          };
        }
      };
    };
  };

  // output/Data.Generic.Rep/index.js
  var Inl = /* @__PURE__ */ function() {
    function Inl2(value0) {
      this.value0 = value0;
    }
    ;
    Inl2.create = function(value0) {
      return new Inl2(value0);
    };
    return Inl2;
  }();
  var Inr = /* @__PURE__ */ function() {
    function Inr2(value0) {
      this.value0 = value0;
    }
    ;
    Inr2.create = function(value0) {
      return new Inr2(value0);
    };
    return Inr2;
  }();
  var Product = /* @__PURE__ */ function() {
    function Product2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Product2.create = function(value0) {
      return function(value1) {
        return new Product2(value0, value1);
      };
    };
    return Product2;
  }();
  var NoArguments = /* @__PURE__ */ function() {
    function NoArguments2() {
    }
    ;
    NoArguments2.value = new NoArguments2();
    return NoArguments2;
  }();
  var from = function(dict) {
    return dict.from;
  };

  // output/Data.Maybe/index.js
  var identity3 = /* @__PURE__ */ identity(categoryFn);
  var Nothing = /* @__PURE__ */ function() {
    function Nothing2() {
    }
    ;
    Nothing2.value = new Nothing2();
    return Nothing2;
  }();
  var Just = /* @__PURE__ */ function() {
    function Just2(value0) {
      this.value0 = value0;
    }
    ;
    Just2.create = function(value0) {
      return new Just2(value0);
    };
    return Just2;
  }();
  var showMaybe = function(dictShow) {
    var show11 = show(dictShow);
    return {
      show: function(v) {
        if (v instanceof Just) {
          return "(Just " + (show11(v.value0) + ")");
        }
        ;
        if (v instanceof Nothing) {
          return "Nothing";
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 223, column 1 - line 225, column 28): " + [v.constructor.name]);
      }
    };
  };
  var maybe = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v;
        }
        ;
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
  var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
  var functorMaybe = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Just) {
          return new Just(v(v1.value0));
        }
        ;
        return Nothing.value;
      };
    }
  };
  var map2 = /* @__PURE__ */ map(functorMaybe);
  var fromMaybe = function(a2) {
    return maybe(a2)(identity3);
  };
  var fromJust = function() {
    return function(v) {
      if (v instanceof Just) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
    };
  };
  var applyMaybe = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return map2(v.value0)(v1);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var bindMaybe = {
    bind: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v1(v.value0);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Apply0: function() {
      return applyMaybe;
    }
  };

  // output/Data.Either/index.js
  var Left = /* @__PURE__ */ function() {
    function Left2(value0) {
      this.value0 = value0;
    }
    ;
    Left2.create = function(value0) {
      return new Left2(value0);
    };
    return Left2;
  }();
  var Right = /* @__PURE__ */ function() {
    function Right2(value0) {
      this.value0 = value0;
    }
    ;
    Right2.create = function(value0) {
      return new Right2(value0);
    };
    return Right2;
  }();
  var functorEither = {
    map: function(f) {
      return function(m) {
        if (m instanceof Left) {
          return new Left(m.value0);
        }
        ;
        if (m instanceof Right) {
          return new Right(f(m.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };
  var either = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return v(v2.value0);
        }
        ;
        if (v2 instanceof Right) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };

  // output/Effect/foreign.js
  var pureE = function(a2) {
    return function() {
      return a2;
    };
  };
  var bindE = function(a2) {
    return function(f) {
      return function() {
        return f(a2())();
      };
    };
  };

  // output/Data.Monoid/index.js
  var monoidString = {
    mempty: "",
    Semigroup0: function() {
      return semigroupString;
    }
  };
  var monoidArray = {
    mempty: [],
    Semigroup0: function() {
      return semigroupArray;
    }
  };
  var mempty = function(dict) {
    return dict.mempty;
  };

  // output/Effect/index.js
  var $runtime_lazy = function(name16, moduleName, init2) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init2();
      state3 = 2;
      return val;
    };
  };
  var monadEffect = {
    Applicative0: function() {
      return applicativeEffect;
    },
    Bind1: function() {
      return bindEffect;
    }
  };
  var bindEffect = {
    bind: bindE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var applicativeEffect = {
    pure: pureE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
    return {
      map: liftA1(applicativeEffect)
    };
  });
  var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
    return {
      apply: ap(monadEffect),
      Functor0: function() {
        return $lazy_functorEffect(0);
      }
    };
  });
  var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);

  // output/Effect.Exception/foreign.js
  function error(msg) {
    return new Error(msg);
  }
  function throwException(e) {
    return function() {
      throw e;
    };
  }

  // output/Effect.Exception/index.js
  var $$throw = function($4) {
    return throwException(error($4));
  };

  // output/Control.Monad.Error.Class/index.js
  var throwError = function(dict) {
    return dict.throwError;
  };
  var catchError = function(dict) {
    return dict.catchError;
  };
  var $$try = function(dictMonadError) {
    var catchError1 = catchError(dictMonadError);
    var Monad0 = dictMonadError.MonadThrow0().Monad0();
    var map29 = map(Monad0.Bind1().Apply0().Functor0());
    var pure21 = pure(Monad0.Applicative0());
    return function(a2) {
      return catchError1(map29(Right.create)(a2))(function($52) {
        return pure21(Left.create($52));
      });
    };
  };

  // output/Data.Identity/index.js
  var Identity = function(x) {
    return x;
  };
  var functorIdentity = {
    map: function(f) {
      return function(m) {
        return f(m);
      };
    }
  };
  var applyIdentity = {
    apply: function(v) {
      return function(v1) {
        return v(v1);
      };
    },
    Functor0: function() {
      return functorIdentity;
    }
  };
  var bindIdentity = {
    bind: function(v) {
      return function(f) {
        return f(v);
      };
    },
    Apply0: function() {
      return applyIdentity;
    }
  };
  var applicativeIdentity = {
    pure: Identity,
    Apply0: function() {
      return applyIdentity;
    }
  };
  var monadIdentity = {
    Applicative0: function() {
      return applicativeIdentity;
    },
    Bind1: function() {
      return bindIdentity;
    }
  };

  // output/Effect.Ref/foreign.js
  var _new = function(val) {
    return function() {
      return { value: val };
    };
  };
  var read = function(ref2) {
    return function() {
      return ref2.value;
    };
  };
  var modifyImpl = function(f) {
    return function(ref2) {
      return function() {
        var t = f(ref2.value);
        ref2.value = t.state;
        return t.value;
      };
    };
  };
  var write = function(val) {
    return function(ref2) {
      return function() {
        ref2.value = val;
      };
    };
  };

  // output/Effect.Ref/index.js
  var $$void2 = /* @__PURE__ */ $$void(functorEffect);
  var $$new = _new;
  var modify$prime = modifyImpl;
  var modify = function(f) {
    return modify$prime(function(s) {
      var s$prime = f(s);
      return {
        state: s$prime,
        value: s$prime
      };
    });
  };
  var modify_ = function(f) {
    return function(s) {
      return $$void2(modify(f)(s));
    };
  };

  // output/Control.Monad.Rec.Class/index.js
  var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindEffect);
  var map3 = /* @__PURE__ */ map(functorEffect);
  var Loop = /* @__PURE__ */ function() {
    function Loop2(value0) {
      this.value0 = value0;
    }
    ;
    Loop2.create = function(value0) {
      return new Loop2(value0);
    };
    return Loop2;
  }();
  var Done = /* @__PURE__ */ function() {
    function Done2(value0) {
      this.value0 = value0;
    }
    ;
    Done2.create = function(value0) {
      return new Done2(value0);
    };
    return Done2;
  }();
  var tailRecM = function(dict) {
    return dict.tailRecM;
  };
  var monadRecEffect = {
    tailRecM: function(f) {
      return function(a2) {
        var fromDone = function(v) {
          if (v instanceof Done) {
            return v.value0;
          }
          ;
          throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 137, column 30 - line 137, column 44): " + [v.constructor.name]);
        };
        return function __do2() {
          var r = bindFlipped2($$new)(f(a2))();
          (function() {
            while (!function __do3() {
              var v = read(r)();
              if (v instanceof Loop) {
                var e = f(v.value0)();
                write(e)(r)();
                return false;
              }
              ;
              if (v instanceof Done) {
                return true;
              }
              ;
              throw new Error("Failed pattern match at Control.Monad.Rec.Class (line 128, column 22 - line 133, column 28): " + [v.constructor.name]);
            }()) {
            }
            ;
            return {};
          })();
          return map3(fromDone)(read(r))();
        };
      };
    },
    Monad0: function() {
      return monadEffect;
    }
  };

  // output/Unsafe.Coerce/foreign.js
  var unsafeCoerce2 = function(x) {
    return x;
  };

  // output/Control.Monad.Reader.Class/index.js
  var local = function(dict) {
    return dict.local;
  };
  var ask = function(dict) {
    return dict.ask;
  };

  // output/Data.HeytingAlgebra/foreign.js
  var boolConj = function(b1) {
    return function(b2) {
      return b1 && b2;
    };
  };
  var boolDisj = function(b1) {
    return function(b2) {
      return b1 || b2;
    };
  };
  var boolNot = function(b2) {
    return !b2;
  };

  // output/Data.HeytingAlgebra/index.js
  var tt = function(dict) {
    return dict.tt;
  };
  var not = function(dict) {
    return dict.not;
  };
  var implies = function(dict) {
    return dict.implies;
  };
  var ff = function(dict) {
    return dict.ff;
  };
  var disj = function(dict) {
    return dict.disj;
  };
  var heytingAlgebraBoolean = {
    ff: false,
    tt: true,
    implies: function(a2) {
      return function(b2) {
        return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a2))(b2);
      };
    },
    conj: boolConj,
    disj: boolDisj,
    not: boolNot
  };
  var conj = function(dict) {
    return dict.conj;
  };
  var heytingAlgebraFunction = function(dictHeytingAlgebra) {
    var ff1 = ff(dictHeytingAlgebra);
    var tt1 = tt(dictHeytingAlgebra);
    var implies1 = implies(dictHeytingAlgebra);
    var conj1 = conj(dictHeytingAlgebra);
    var disj1 = disj(dictHeytingAlgebra);
    var not1 = not(dictHeytingAlgebra);
    return {
      ff: function(v) {
        return ff1;
      },
      tt: function(v) {
        return tt1;
      },
      implies: function(f) {
        return function(g) {
          return function(a2) {
            return implies1(f(a2))(g(a2));
          };
        };
      },
      conj: function(f) {
        return function(g) {
          return function(a2) {
            return conj1(f(a2))(g(a2));
          };
        };
      },
      disj: function(f) {
        return function(g) {
          return function(a2) {
            return disj1(f(a2))(g(a2));
          };
        };
      },
      not: function(f) {
        return function(a2) {
          return not1(f(a2));
        };
      }
    };
  };

  // output/Data.Tuple/index.js
  var Tuple = /* @__PURE__ */ function() {
    function Tuple2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Tuple2.create = function(value0) {
      return function(value1) {
        return new Tuple2(value0, value1);
      };
    };
    return Tuple2;
  }();
  var snd = function(v) {
    return v.value1;
  };
  var showTuple = function(dictShow) {
    var show11 = show(dictShow);
    return function(dictShow1) {
      var show14 = show(dictShow1);
      return {
        show: function(v) {
          return "(Tuple " + (show11(v.value0) + (" " + (show14(v.value1) + ")")));
        }
      };
    };
  };
  var functorTuple = {
    map: function(f) {
      return function(m) {
        return new Tuple(m.value0, f(m.value1));
      };
    }
  };
  var fst = function(v) {
    return v.value0;
  };
  var eqTuple = function(dictEq) {
    var eq4 = eq(dictEq);
    return function(dictEq1) {
      var eq12 = eq(dictEq1);
      return {
        eq: function(x) {
          return function(y) {
            return eq4(x.value0)(y.value0) && eq12(x.value1)(y.value1);
          };
        }
      };
    };
  };
  var ordTuple = function(dictOrd) {
    var compare4 = compare(dictOrd);
    var eqTuple1 = eqTuple(dictOrd.Eq0());
    return function(dictOrd1) {
      var compare13 = compare(dictOrd1);
      var eqTuple2 = eqTuple1(dictOrd1.Eq0());
      return {
        compare: function(x) {
          return function(y) {
            var v = compare4(x.value0)(y.value0);
            if (v instanceof LT) {
              return LT.value;
            }
            ;
            if (v instanceof GT) {
              return GT.value;
            }
            ;
            return compare13(x.value1)(y.value1);
          };
        },
        Eq0: function() {
          return eqTuple2;
        }
      };
    };
  };

  // output/Control.Monad.State.Class/index.js
  var state = function(dict) {
    return dict.state;
  };
  var modify_2 = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s) {
        return new Tuple(unit, f(s));
      });
    };
  };
  var modify2 = function(dictMonadState) {
    var state1 = state(dictMonadState);
    return function(f) {
      return state1(function(s) {
        var s$prime = f(s);
        return new Tuple(s$prime, s$prime);
      });
    };
  };
  var get = function(dictMonadState) {
    return state(dictMonadState)(function(s) {
      return new Tuple(s, s);
    });
  };

  // output/Control.Monad.Trans.Class/index.js
  var lift = function(dict) {
    return dict.lift;
  };

  // output/Effect.Class/index.js
  var monadEffectEffect = {
    liftEffect: /* @__PURE__ */ identity(categoryFn),
    Monad0: function() {
      return monadEffect;
    }
  };
  var liftEffect = function(dict) {
    return dict.liftEffect;
  };

  // output/Control.Monad.Writer.Class/index.js
  var tell = function(dict) {
    return dict.tell;
  };
  var pass = function(dict) {
    return dict.pass;
  };
  var listen = function(dict) {
    return dict.listen;
  };

  // output/Control.Monad.Except.Trans/index.js
  var map4 = /* @__PURE__ */ map(functorEither);
  var identity4 = /* @__PURE__ */ identity(categoryFn);
  var ExceptT = function(x) {
    return x;
  };
  var runExceptT = function(v) {
    return v;
  };
  var monadTransExceptT = {
    lift: function(dictMonad) {
      var bind9 = bind(dictMonad.Bind1());
      var pure21 = pure(dictMonad.Applicative0());
      return function(m) {
        return bind9(m)(function(a2) {
          return pure21(new Right(a2));
        });
      };
    }
  };
  var lift3 = /* @__PURE__ */ lift(monadTransExceptT);
  var mapExceptT = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var functorExceptT = function(dictFunctor) {
    var map112 = map(dictFunctor);
    return {
      map: function(f) {
        return mapExceptT(map112(map4(f)));
      }
    };
  };
  var monadExceptT = function(dictMonad) {
    return {
      Applicative0: function() {
        return applicativeExceptT(dictMonad);
      },
      Bind1: function() {
        return bindExceptT(dictMonad);
      }
    };
  };
  var bindExceptT = function(dictMonad) {
    var bind9 = bind(dictMonad.Bind1());
    var pure21 = pure(dictMonad.Applicative0());
    return {
      bind: function(v) {
        return function(k) {
          return bind9(v)(either(function($187) {
            return pure21(Left.create($187));
          })(function(a2) {
            var v1 = k(a2);
            return v1;
          }));
        };
      },
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var applyExceptT = function(dictMonad) {
    var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
    return {
      apply: ap(monadExceptT(dictMonad)),
      Functor0: function() {
        return functorExceptT1;
      }
    };
  };
  var applicativeExceptT = function(dictMonad) {
    return {
      pure: function() {
        var $188 = pure(dictMonad.Applicative0());
        return function($189) {
          return ExceptT($188(Right.create($189)));
        };
      }(),
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var monadAskExceptT = function(dictMonadAsk) {
    var Monad0 = dictMonadAsk.Monad0();
    var monadExceptT1 = monadExceptT(Monad0);
    return {
      ask: lift3(Monad0)(ask(dictMonadAsk)),
      Monad0: function() {
        return monadExceptT1;
      }
    };
  };
  var monadReaderExceptT = function(dictMonadReader) {
    var local2 = local(dictMonadReader);
    var monadAskExceptT1 = monadAskExceptT(dictMonadReader.MonadAsk0());
    return {
      local: function(f) {
        return mapExceptT(local2(f));
      },
      MonadAsk0: function() {
        return monadAskExceptT1;
      }
    };
  };
  var monadStateExceptT = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var lift1 = lift3(Monad0);
    var state3 = state(dictMonadState);
    var monadExceptT1 = monadExceptT(Monad0);
    return {
      state: function(f) {
        return lift1(state3(f));
      },
      Monad0: function() {
        return monadExceptT1;
      }
    };
  };
  var monadTellExceptT = function(dictMonadTell) {
    var Monad1 = dictMonadTell.Monad1();
    var Semigroup0 = dictMonadTell.Semigroup0();
    var monadExceptT1 = monadExceptT(Monad1);
    return {
      tell: function() {
        var $195 = lift3(Monad1);
        var $196 = tell(dictMonadTell);
        return function($197) {
          return $195($196($197));
        };
      }(),
      Semigroup0: function() {
        return Semigroup0;
      },
      Monad1: function() {
        return monadExceptT1;
      }
    };
  };
  var monadWriterExceptT = function(dictMonadWriter) {
    var MonadTell1 = dictMonadWriter.MonadTell1();
    var Monad1 = MonadTell1.Monad1();
    var bind9 = bind(Monad1.Bind1());
    var listen2 = listen(dictMonadWriter);
    var pure21 = pure(Monad1.Applicative0());
    var pass2 = pass(dictMonadWriter);
    var Monoid0 = dictMonadWriter.Monoid0();
    var monadTellExceptT1 = monadTellExceptT(MonadTell1);
    return {
      listen: mapExceptT(function(m) {
        return bind9(listen2(m))(function(v) {
          return pure21(map4(function(r) {
            return new Tuple(r, v.value1);
          })(v.value0));
        });
      }),
      pass: mapExceptT(function(m) {
        return pass2(bind9(m)(function(a2) {
          return pure21(function() {
            if (a2 instanceof Left) {
              return new Tuple(new Left(a2.value0), identity4);
            }
            ;
            if (a2 instanceof Right) {
              return new Tuple(new Right(a2.value0.value0), a2.value0.value1);
            }
            ;
            throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 134, column 10 - line 136, column 45): " + [a2.constructor.name]);
          }());
        }));
      }),
      Monoid0: function() {
        return Monoid0;
      },
      MonadTell1: function() {
        return monadTellExceptT1;
      }
    };
  };
  var monadThrowExceptT = function(dictMonad) {
    var monadExceptT1 = monadExceptT(dictMonad);
    return {
      throwError: function() {
        var $198 = pure(dictMonad.Applicative0());
        return function($199) {
          return ExceptT($198(Left.create($199)));
        };
      }(),
      Monad0: function() {
        return monadExceptT1;
      }
    };
  };

  // output/Control.Plus/index.js
  var empty = function(dict) {
    return dict.empty;
  };

  // output/Safe.Coerce/index.js
  var coerce = function() {
    return unsafeCoerce2;
  };

  // output/Data.Newtype/index.js
  var coerce2 = /* @__PURE__ */ coerce();
  var unwrap = function() {
    return coerce2;
  };

  // output/Control.Monad.Reader.Trans/index.js
  var ReaderT = function(x) {
    return x;
  };
  var withReaderT = function(f) {
    return function(v) {
      return function($146) {
        return v(f($146));
      };
    };
  };
  var runReaderT = function(v) {
    return v;
  };
  var monadTransReaderT = {
    lift: function(dictMonad) {
      return function($147) {
        return ReaderT($$const($147));
      };
    }
  };
  var lift4 = /* @__PURE__ */ lift(monadTransReaderT);
  var mapReaderT = function(f) {
    return function(v) {
      return function($148) {
        return f(v($148));
      };
    };
  };
  var functorReaderT = function(dictFunctor) {
    return {
      map: function() {
        var $149 = map(dictFunctor);
        return function($150) {
          return mapReaderT($149($150));
        };
      }()
    };
  };
  var applyReaderT = function(dictApply) {
    var apply2 = apply(dictApply);
    var functorReaderT1 = functorReaderT(dictApply.Functor0());
    return {
      apply: function(v) {
        return function(v1) {
          return function(r) {
            return apply2(v(r))(v1(r));
          };
        };
      },
      Functor0: function() {
        return functorReaderT1;
      }
    };
  };
  var bindReaderT = function(dictBind) {
    var bind9 = bind(dictBind);
    var applyReaderT1 = applyReaderT(dictBind.Apply0());
    return {
      bind: function(v) {
        return function(k) {
          return function(r) {
            return bind9(v(r))(function(a2) {
              var v1 = k(a2);
              return v1(r);
            });
          };
        };
      },
      Apply0: function() {
        return applyReaderT1;
      }
    };
  };
  var semigroupReaderT = function(dictApply) {
    var lift22 = lift2(applyReaderT(dictApply));
    return function(dictSemigroup) {
      return {
        append: lift22(append(dictSemigroup))
      };
    };
  };
  var applicativeReaderT = function(dictApplicative) {
    var applyReaderT1 = applyReaderT(dictApplicative.Apply0());
    return {
      pure: function() {
        var $154 = pure(dictApplicative);
        return function($155) {
          return ReaderT($$const($154($155)));
        };
      }(),
      Apply0: function() {
        return applyReaderT1;
      }
    };
  };
  var monadReaderT = function(dictMonad) {
    var applicativeReaderT1 = applicativeReaderT(dictMonad.Applicative0());
    var bindReaderT1 = bindReaderT(dictMonad.Bind1());
    return {
      Applicative0: function() {
        return applicativeReaderT1;
      },
      Bind1: function() {
        return bindReaderT1;
      }
    };
  };
  var monadAskReaderT = function(dictMonad) {
    var monadReaderT1 = monadReaderT(dictMonad);
    return {
      ask: pure(dictMonad.Applicative0()),
      Monad0: function() {
        return monadReaderT1;
      }
    };
  };
  var monadReaderReaderT = function(dictMonad) {
    var monadAskReaderT1 = monadAskReaderT(dictMonad);
    return {
      local: withReaderT,
      MonadAsk0: function() {
        return monadAskReaderT1;
      }
    };
  };
  var monadStateReaderT = function(dictMonadState) {
    var Monad0 = dictMonadState.Monad0();
    var monadReaderT1 = monadReaderT(Monad0);
    return {
      state: function() {
        var $160 = lift4(Monad0);
        var $161 = state(dictMonadState);
        return function($162) {
          return $160($161($162));
        };
      }(),
      Monad0: function() {
        return monadReaderT1;
      }
    };
  };
  var monadTellReaderT = function(dictMonadTell) {
    var Monad1 = dictMonadTell.Monad1();
    var Semigroup0 = dictMonadTell.Semigroup0();
    var monadReaderT1 = monadReaderT(Monad1);
    return {
      tell: function() {
        var $163 = lift4(Monad1);
        var $164 = tell(dictMonadTell);
        return function($165) {
          return $163($164($165));
        };
      }(),
      Semigroup0: function() {
        return Semigroup0;
      },
      Monad1: function() {
        return monadReaderT1;
      }
    };
  };
  var monadWriterReaderT = function(dictMonadWriter) {
    var Monoid0 = dictMonadWriter.Monoid0();
    var monadTellReaderT1 = monadTellReaderT(dictMonadWriter.MonadTell1());
    return {
      listen: mapReaderT(listen(dictMonadWriter)),
      pass: mapReaderT(pass(dictMonadWriter)),
      Monoid0: function() {
        return Monoid0;
      },
      MonadTell1: function() {
        return monadTellReaderT1;
      }
    };
  };
  var monoidReaderT = function(dictApplicative) {
    var pure21 = pure(applicativeReaderT(dictApplicative));
    var semigroupReaderT1 = semigroupReaderT(dictApplicative.Apply0());
    return function(dictMonoid) {
      var semigroupReaderT2 = semigroupReaderT1(dictMonoid.Semigroup0());
      return {
        mempty: pure21(mempty(dictMonoid)),
        Semigroup0: function() {
          return semigroupReaderT2;
        }
      };
    };
  };

  // output/Control.Monad.Writer.Trans/index.js
  var WriterT = function(x) {
    return x;
  };
  var runWriterT = function(v) {
    return v;
  };
  var monadTransWriterT = function(dictMonoid) {
    var mempty4 = mempty(dictMonoid);
    return {
      lift: function(dictMonad) {
        var bind9 = bind(dictMonad.Bind1());
        var pure21 = pure(dictMonad.Applicative0());
        return function(m) {
          return bind9(m)(function(a2) {
            return pure21(new Tuple(a2, mempty4));
          });
        };
      }
    };
  };
  var mapWriterT = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var functorWriterT = function(dictFunctor) {
    var map29 = map(dictFunctor);
    return {
      map: function(f) {
        return mapWriterT(map29(function(v) {
          return new Tuple(f(v.value0), v.value1);
        }));
      }
    };
  };
  var applyWriterT = function(dictSemigroup) {
    var append10 = append(dictSemigroup);
    return function(dictApply) {
      var apply2 = apply(dictApply);
      var Functor0 = dictApply.Functor0();
      var map29 = map(Functor0);
      var functorWriterT1 = functorWriterT(Functor0);
      return {
        apply: function(v) {
          return function(v1) {
            var k = function(v3) {
              return function(v4) {
                return new Tuple(v3.value0(v4.value0), append10(v3.value1)(v4.value1));
              };
            };
            return apply2(map29(k)(v))(v1);
          };
        },
        Functor0: function() {
          return functorWriterT1;
        }
      };
    };
  };
  var bindWriterT = function(dictSemigroup) {
    var append10 = append(dictSemigroup);
    var applyWriterT1 = applyWriterT(dictSemigroup);
    return function(dictBind) {
      var bind9 = bind(dictBind);
      var Apply0 = dictBind.Apply0();
      var map29 = map(Apply0.Functor0());
      var applyWriterT2 = applyWriterT1(Apply0);
      return {
        bind: function(v) {
          return function(k) {
            return bind9(v)(function(v1) {
              var v2 = k(v1.value0);
              return map29(function(v3) {
                return new Tuple(v3.value0, append10(v1.value1)(v3.value1));
              })(v2);
            });
          };
        },
        Apply0: function() {
          return applyWriterT2;
        }
      };
    };
  };
  var applicativeWriterT = function(dictMonoid) {
    var mempty4 = mempty(dictMonoid);
    var applyWriterT1 = applyWriterT(dictMonoid.Semigroup0());
    return function(dictApplicative) {
      var pure21 = pure(dictApplicative);
      var applyWriterT2 = applyWriterT1(dictApplicative.Apply0());
      return {
        pure: function(a2) {
          return pure21(new Tuple(a2, mempty4));
        },
        Apply0: function() {
          return applyWriterT2;
        }
      };
    };
  };
  var monadWriterT = function(dictMonoid) {
    var applicativeWriterT1 = applicativeWriterT(dictMonoid);
    var bindWriterT1 = bindWriterT(dictMonoid.Semigroup0());
    return function(dictMonad) {
      var applicativeWriterT2 = applicativeWriterT1(dictMonad.Applicative0());
      var bindWriterT2 = bindWriterT1(dictMonad.Bind1());
      return {
        Applicative0: function() {
          return applicativeWriterT2;
        },
        Bind1: function() {
          return bindWriterT2;
        }
      };
    };
  };
  var monadTellWriterT = function(dictMonoid) {
    var Semigroup0 = dictMonoid.Semigroup0();
    var monadWriterT1 = monadWriterT(dictMonoid);
    return function(dictMonad) {
      var monadWriterT2 = monadWriterT1(dictMonad);
      return {
        tell: function() {
          var $252 = pure(dictMonad.Applicative0());
          var $253 = Tuple.create(unit);
          return function($254) {
            return WriterT($252($253($254)));
          };
        }(),
        Semigroup0: function() {
          return Semigroup0;
        },
        Monad1: function() {
          return monadWriterT2;
        }
      };
    };
  };
  var monadWriterWriterT = function(dictMonoid) {
    var monadTellWriterT1 = monadTellWriterT(dictMonoid);
    return function(dictMonad) {
      var bind9 = bind(dictMonad.Bind1());
      var pure21 = pure(dictMonad.Applicative0());
      var monadTellWriterT2 = monadTellWriterT1(dictMonad);
      return {
        listen: function(v) {
          return bind9(v)(function(v1) {
            return pure21(new Tuple(new Tuple(v1.value0, v1.value1), v1.value1));
          });
        },
        pass: function(v) {
          return bind9(v)(function(v1) {
            return pure21(new Tuple(v1.value0.value0, v1.value0.value1(v1.value1)));
          });
        },
        Monoid0: function() {
          return dictMonoid;
        },
        MonadTell1: function() {
          return monadTellWriterT2;
        }
      };
    };
  };
  var monadThrowWriterT = function(dictMonoid) {
    var lift8 = lift(monadTransWriterT(dictMonoid));
    var monadWriterT1 = monadWriterT(dictMonoid);
    return function(dictMonadThrow) {
      var Monad0 = dictMonadThrow.Monad0();
      var lift1 = lift8(Monad0);
      var throwError3 = throwError(dictMonadThrow);
      var monadWriterT2 = monadWriterT1(Monad0);
      return {
        throwError: function(e) {
          return lift1(throwError3(e));
        },
        Monad0: function() {
          return monadWriterT2;
        }
      };
    };
  };

  // output/Data.Profunctor/index.js
  var dimap = function(dict) {
    return dict.dimap;
  };

  // output/Control.Parallel.Class/index.js
  var sequential = function(dict) {
    return dict.sequential;
  };
  var parallel = function(dict) {
    return dict.parallel;
  };

  // output/Data.Foldable/foreign.js
  var foldrArray = function(f) {
    return function(init2) {
      return function(xs) {
        var acc = init2;
        var len = xs.length;
        for (var i2 = len - 1; i2 >= 0; i2--) {
          acc = f(xs[i2])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f) {
    return function(init2) {
      return function(xs) {
        var acc = init2;
        var len = xs.length;
        for (var i2 = 0; i2 < len; i2++) {
          acc = f(acc)(xs[i2]);
        }
        return acc;
      };
    };
  };

  // output/Data.Bifunctor/index.js
  var identity5 = /* @__PURE__ */ identity(categoryFn);
  var bimap = function(dict) {
    return dict.bimap;
  };
  var lmap = function(dictBifunctor) {
    var bimap1 = bimap(dictBifunctor);
    return function(f) {
      return bimap1(f)(identity5);
    };
  };
  var rmap = function(dictBifunctor) {
    return bimap(dictBifunctor)(identity5);
  };
  var bifunctorTuple = {
    bimap: function(f) {
      return function(g) {
        return function(v) {
          return new Tuple(f(v.value0), g(v.value1));
        };
      };
    }
  };
  var bifunctorEither = {
    bimap: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return new Left(v(v2.value0));
          }
          ;
          if (v2 instanceof Right) {
            return new Right(v1(v2.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Bifunctor (line 32, column 1 - line 34, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    }
  };

  // output/Data.Foldable/index.js
  var identity6 = /* @__PURE__ */ identity(categoryFn);
  var foldr = function(dict) {
    return dict.foldr;
  };
  var traverse_ = function(dictApplicative) {
    var applySecond2 = applySecond(dictApplicative.Apply0());
    var pure21 = pure(dictApplicative);
    return function(dictFoldable) {
      var foldr23 = foldr(dictFoldable);
      return function(f) {
        return foldr23(function($454) {
          return applySecond2(f($454));
        })(pure21(unit));
      };
    };
  };
  var for_ = function(dictApplicative) {
    var traverse_14 = traverse_(dictApplicative);
    return function(dictFoldable) {
      return flip(traverse_14(dictFoldable));
    };
  };
  var foldl = function(dict) {
    return dict.foldl;
  };
  var intercalate = function(dictFoldable) {
    var foldl23 = foldl(dictFoldable);
    return function(dictMonoid) {
      var append10 = append(dictMonoid.Semigroup0());
      var mempty4 = mempty(dictMonoid);
      return function(sep) {
        return function(xs) {
          var go2 = function(v) {
            return function(v1) {
              if (v.init) {
                return {
                  init: false,
                  acc: v1
                };
              }
              ;
              return {
                init: false,
                acc: append10(v.acc)(append10(sep)(v1))
              };
            };
          };
          return foldl23(go2)({
            init: true,
            acc: mempty4
          })(xs).acc;
        };
      };
    };
  };
  var foldableMaybe = {
    foldr: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v2 instanceof Just) {
            return v(v2.value0)(v1);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldl: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nothing) {
            return v1;
          }
          ;
          if (v2 instanceof Just) {
            return v(v1)(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty4 = mempty(dictMonoid);
      return function(v) {
        return function(v1) {
          if (v1 instanceof Nothing) {
            return mempty4;
          }
          ;
          if (v1 instanceof Just) {
            return v(v1.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name]);
        };
      };
    }
  };
  var foldMapDefaultR = function(dictFoldable) {
    var foldr23 = foldr(dictFoldable);
    return function(dictMonoid) {
      var append10 = append(dictMonoid.Semigroup0());
      var mempty4 = mempty(dictMonoid);
      return function(f) {
        return foldr23(function(x) {
          return function(acc) {
            return append10(f(x))(acc);
          };
        })(mempty4);
      };
    };
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: function(dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
    }
  };
  var foldMap = function(dict) {
    return dict.foldMap;
  };
  var fold = function(dictFoldable) {
    var foldMap23 = foldMap(dictFoldable);
    return function(dictMonoid) {
      return foldMap23(dictMonoid)(identity6);
    };
  };

  // output/Data.Traversable/foreign.js
  var traverseArrayImpl = /* @__PURE__ */ function() {
    function array1(a2) {
      return [a2];
    }
    function array2(a2) {
      return function(b2) {
        return [a2, b2];
      };
    }
    function array3(a2) {
      return function(b2) {
        return function(c) {
          return [a2, b2, c];
        };
      };
    }
    function concat2(xs) {
      return function(ys) {
        return xs.concat(ys);
      };
    }
    return function(apply2) {
      return function(map29) {
        return function(pure21) {
          return function(f) {
            return function(array) {
              function go2(bot, top2) {
                switch (top2 - bot) {
                  case 0:
                    return pure21([]);
                  case 1:
                    return map29(array1)(f(array[bot]));
                  case 2:
                    return apply2(map29(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply2(apply2(map29(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top2 - bot) / 4) * 2;
                    return apply2(map29(concat2)(go2(bot, pivot)))(go2(pivot, top2));
                }
              }
              return go2(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output/Data.Traversable/index.js
  var identity7 = /* @__PURE__ */ identity(categoryFn);
  var traverse = function(dict) {
    return dict.traverse;
  };
  var sequenceDefault = function(dictTraversable) {
    var traverse24 = traverse(dictTraversable);
    return function(dictApplicative) {
      return traverse24(dictApplicative)(identity7);
    };
  };
  var traversableArray = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
    },
    sequence: function(dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
    },
    Functor0: function() {
      return functorArray;
    },
    Foldable1: function() {
      return foldableArray;
    }
  };

  // output/Control.Parallel/index.js
  var identity8 = /* @__PURE__ */ identity(categoryFn);
  var parTraverse_ = function(dictParallel) {
    var sequential3 = sequential(dictParallel);
    var parallel4 = parallel(dictParallel);
    return function(dictApplicative) {
      var traverse_7 = traverse_(dictApplicative);
      return function(dictFoldable) {
        var traverse_14 = traverse_7(dictFoldable);
        return function(f) {
          var $51 = traverse_14(function($53) {
            return parallel4(f($53));
          });
          return function($52) {
            return sequential3($51($52));
          };
        };
      };
    };
  };
  var parSequence_ = function(dictParallel) {
    var parTraverse_1 = parTraverse_(dictParallel);
    return function(dictApplicative) {
      var parTraverse_2 = parTraverse_1(dictApplicative);
      return function(dictFoldable) {
        return parTraverse_2(dictFoldable)(identity8);
      };
    };
  };

  // output/Effect.Unsafe/foreign.js
  var unsafePerformEffect = function(f) {
    return f();
  };

  // output/Partial.Unsafe/foreign.js
  var _unsafePartial = function(f) {
    return f();
  };

  // output/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output/Partial/index.js
  var crashWith = function() {
    return _crashWith;
  };

  // output/Partial.Unsafe/index.js
  var crashWith2 = /* @__PURE__ */ crashWith();
  var unsafePartial = _unsafePartial;
  var unsafeCrashWith = function(msg) {
    return unsafePartial(function() {
      return crashWith2(msg);
    });
  };

  // output/Effect.Aff/index.js
  var $runtime_lazy2 = function(name16, moduleName, init2) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init2();
      state3 = 2;
      return val;
    };
  };
  var pure2 = /* @__PURE__ */ pure(applicativeEffect);
  var $$void3 = /* @__PURE__ */ $$void(functorEffect);
  var map5 = /* @__PURE__ */ map(functorEffect);
  var Canceler = function(x) {
    return x;
  };
  var suspendAff = /* @__PURE__ */ _fork(false);
  var functorParAff = {
    map: _parAffMap
  };
  var functorAff = {
    map: _map
  };
  var map1 = /* @__PURE__ */ map(functorAff);
  var forkAff = /* @__PURE__ */ _fork(true);
  var ffiUtil = /* @__PURE__ */ function() {
    var unsafeFromRight = function(v) {
      if (v instanceof Right) {
        return v.value0;
      }
      ;
      if (v instanceof Left) {
        return unsafeCrashWith("unsafeFromRight: Left");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
    };
    var unsafeFromLeft = function(v) {
      if (v instanceof Left) {
        return v.value0;
      }
      ;
      if (v instanceof Right) {
        return unsafeCrashWith("unsafeFromLeft: Right");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
    };
    var isLeft = function(v) {
      if (v instanceof Left) {
        return true;
      }
      ;
      if (v instanceof Right) {
        return false;
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
    };
    return {
      isLeft,
      fromLeft: unsafeFromLeft,
      fromRight: unsafeFromRight,
      left: Left.create,
      right: Right.create
    };
  }();
  var makeFiber = function(aff) {
    return _makeFiber(ffiUtil, aff);
  };
  var launchAff = function(aff) {
    return function __do2() {
      var fiber = makeFiber(aff)();
      fiber.run();
      return fiber;
    };
  };
  var bracket = function(acquire) {
    return function(completed) {
      return generalBracket(acquire)({
        killed: $$const(completed),
        failed: $$const(completed),
        completed: $$const(completed)
      });
    };
  };
  var applyParAff = {
    apply: _parAffApply,
    Functor0: function() {
      return functorParAff;
    }
  };
  var monadAff = {
    Applicative0: function() {
      return applicativeAff;
    },
    Bind1: function() {
      return bindAff;
    }
  };
  var bindAff = {
    bind: _bind,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var applicativeAff = {
    pure: _pure,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
    return {
      apply: ap(monadAff),
      Functor0: function() {
        return functorAff;
      }
    };
  });
  var applyAff = /* @__PURE__ */ $lazy_applyAff(73);
  var pure22 = /* @__PURE__ */ pure(applicativeAff);
  var bind1 = /* @__PURE__ */ bind(bindAff);
  var bindFlipped3 = /* @__PURE__ */ bindFlipped(bindAff);
  var $$finally = function(fin) {
    return function(a2) {
      return bracket(pure22(unit))($$const(fin))($$const(a2));
    };
  };
  var parallelAff = {
    parallel: unsafeCoerce2,
    sequential: _sequential,
    Apply0: function() {
      return applyAff;
    },
    Apply1: function() {
      return applyParAff;
    }
  };
  var parallel2 = /* @__PURE__ */ parallel(parallelAff);
  var applicativeParAff = {
    pure: function($76) {
      return parallel2(pure22($76));
    },
    Apply0: function() {
      return applyParAff;
    }
  };
  var monadEffectAff = {
    liftEffect: _liftEffect,
    Monad0: function() {
      return monadAff;
    }
  };
  var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var effectCanceler = function($77) {
    return Canceler($$const(liftEffect2($77)));
  };
  var joinFiber = function(v) {
    return makeAff(function(k) {
      return map5(effectCanceler)(v.join(k));
    });
  };
  var functorFiber = {
    map: function(f) {
      return function(t) {
        return unsafePerformEffect(makeFiber(map1(f)(joinFiber(t))));
      };
    }
  };
  var killFiber = function(e) {
    return function(v) {
      return bind1(liftEffect2(v.isSuspended))(function(suspended) {
        if (suspended) {
          return liftEffect2($$void3(v.kill(e, $$const(pure2(unit)))));
        }
        ;
        return makeAff(function(k) {
          return map5(effectCanceler)(v.kill(e, k));
        });
      });
    };
  };
  var monadThrowAff = {
    throwError: _throwError,
    Monad0: function() {
      return monadAff;
    }
  };
  var monadErrorAff = {
    catchError: _catchError,
    MonadThrow0: function() {
      return monadThrowAff;
    }
  };
  var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
  var runAff = function(k) {
    return function(aff) {
      return launchAff(bindFlipped3(function($83) {
        return liftEffect2(k($83));
      })($$try2(aff)));
    };
  };
  var runAff_ = function(k) {
    return function(aff) {
      return $$void3(runAff(k)(aff));
    };
  };
  var monadRecAff = {
    tailRecM: function(k) {
      var go2 = function(a2) {
        return bind1(k(a2))(function(res) {
          if (res instanceof Done) {
            return pure22(res.value0);
          }
          ;
          if (res instanceof Loop) {
            return go2(res.value0);
          }
          ;
          throw new Error("Failed pattern match at Effect.Aff (line 104, column 7 - line 106, column 23): " + [res.constructor.name]);
        });
      };
      return go2;
    },
    Monad0: function() {
      return monadAff;
    }
  };
  var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure22(unit));

  // output/Effect.Console/foreign.js
  var log = function(s) {
    return function() {
      console.log(s);
    };
  };
  var warn = function(s) {
    return function() {
      console.warn(s);
    };
  };

  // output/Effect.Class.Console/index.js
  var log2 = function(dictMonadEffect) {
    var $67 = liftEffect(dictMonadEffect);
    return function($68) {
      return $67(log($68));
    };
  };

  // output/Data.Lazy/foreign.js
  var defer2 = function(thunk) {
    var v = null;
    return function() {
      if (thunk === void 0)
        return v;
      v = thunk();
      thunk = void 0;
      return v;
    };
  };
  var force = function(l) {
    return l();
  };

  // output/Debug/foreign.js
  var req = typeof module === "undefined" ? void 0 : module.require;
  var util = function() {
    try {
      return req === void 0 ? void 0 : req("util");
    } catch (e) {
      return void 0;
    }
  }();
  function _trace(x, k) {
    if (util !== void 0) {
      console.log(util.inspect(x, { depth: null, colors: true }));
    } else {
      console.log(x);
    }
    return k({});
  }
  var now = function() {
    var perf;
    if (typeof performance !== "undefined") {
      perf = performance;
    } else if (req) {
      try {
        perf = req("perf_hooks").performance;
      } catch (e) {
      }
    }
    return function() {
      return (perf || Date).now();
    };
  }();

  // output/Data.Function.Uncurried/foreign.js
  var runFn2 = function(fn) {
    return function(a2) {
      return function(b2) {
        return fn(a2, b2);
      };
    };
  };
  var runFn3 = function(fn) {
    return function(a2) {
      return function(b2) {
        return function(c) {
          return fn(a2, b2, c);
        };
      };
    };
  };
  var runFn4 = function(fn) {
    return function(a2) {
      return function(b2) {
        return function(c) {
          return function(d) {
            return fn(a2, b2, c, d);
          };
        };
      };
    };
  };

  // output/Debug/index.js
  var discard2 = /* @__PURE__ */ discard(discardUnit);
  var trace = function() {
    return function(a2) {
      return function(k) {
        return _trace(a2, k);
      };
    };
  };
  var trace1 = /* @__PURE__ */ trace();
  var traceM = function() {
    return function(dictMonad) {
      var discard13 = discard2(dictMonad.Bind1());
      var pure21 = pure(dictMonad.Applicative0());
      return function(s) {
        return discard13(pure21(unit))(function() {
          return trace1(s)(function(v) {
            return pure21(unit);
          });
        });
      };
    };
  };

  // output/Data.Array/foreign.js
  var replicateFill = function(count, value12) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value12);
  };
  var replicatePolyfill = function(count, value12) {
    var result = [];
    var n = 0;
    for (var i2 = 0; i2 < count; i2++) {
      result[n++] = value12;
    }
    return result;
  };
  var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = /* @__PURE__ */ function() {
    function Cons2(head2, tail) {
      this.head = head2;
      this.tail = tail;
    }
    var emptyList = {};
    function curryCons(head2) {
      return function(tail) {
        return new Cons2(head2, tail);
      };
    }
    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }
    return function(foldr8, xs) {
      return listToArray(foldr8(curryCons)(emptyList)(xs));
    };
  }();
  var length = function(xs) {
    return xs.length;
  };
  var findIndexImpl = function(just, nothing, f, xs) {
    for (var i2 = 0, l = xs.length; i2 < l; i2++) {
      if (f(xs[i2]))
        return just(i2);
    }
    return nothing;
  };
  var _deleteAt = function(just, nothing, i2, l) {
    if (i2 < 0 || i2 >= l.length)
      return nothing;
    var l1 = l.slice();
    l1.splice(i2, 1);
    return just(l1);
  };
  var concat = function(xss) {
    if (xss.length <= 1e4) {
      return Array.prototype.concat.apply([], xss);
    }
    var result = [];
    for (var i2 = 0, l = xss.length; i2 < l; i2++) {
      var xs = xss[i2];
      for (var j = 0, m = xs.length; j < m; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };
  var zipWithImpl = function(f, xs, ys) {
    var l = xs.length < ys.length ? xs.length : ys.length;
    var result = new Array(l);
    for (var i2 = 0; i2 < l; i2++) {
      result[i2] = f(xs[i2])(ys[i2]);
    }
    return result;
  };

  // output/Data.Array.ST/foreign.js
  function unsafeFreezeThawImpl(xs) {
    return xs;
  }
  var unsafeFreezeImpl = unsafeFreezeThawImpl;
  function copyImpl(xs) {
    return xs.slice();
  }
  var thawImpl = copyImpl;
  var pushImpl = function(a2, xs) {
    return xs.push(a2);
  };

  // output/Control.Monad.ST.Uncurried/foreign.js
  var runSTFn1 = function runSTFn12(fn) {
    return function(a2) {
      return function() {
        return fn(a2);
      };
    };
  };
  var runSTFn2 = function runSTFn22(fn) {
    return function(a2) {
      return function(b2) {
        return function() {
          return fn(a2, b2);
        };
      };
    };
  };

  // output/Data.Array.ST/index.js
  var unsafeFreeze = /* @__PURE__ */ runSTFn1(unsafeFreezeImpl);
  var thaw = /* @__PURE__ */ runSTFn1(thawImpl);
  var withArray = function(f) {
    return function(xs) {
      return function __do2() {
        var result = thaw(xs)();
        f(result)();
        return unsafeFreeze(result)();
      };
    };
  };
  var push = /* @__PURE__ */ runSTFn2(pushImpl);

  // output/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function(f) {
    return function(xs) {
      var l = xs.length;
      var result = Array(l);
      for (var i2 = 0; i2 < l; i2++) {
        result[i2] = f(i2)(xs[i2]);
      }
      return result;
    };
  };

  // output/Data.FunctorWithIndex/index.js
  var mapWithIndex = function(dict) {
    return dict.mapWithIndex;
  };
  var functorWithIndexArray = {
    mapWithIndex: mapWithIndexArray,
    Functor0: function() {
      return functorArray;
    }
  };

  // output/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust6) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b2) {
              var result = [];
              var value12 = b2;
              while (true) {
                var maybe2 = f(value12);
                if (isNothing2(maybe2))
                  return result;
                var tuple = fromJust6(maybe2);
                result.push(fst2(tuple));
                value12 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust6) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b2) {
              var result = [];
              var value12 = b2;
              while (true) {
                var tuple = f(value12);
                result.push(fst2(tuple));
                var maybe2 = snd2(tuple);
                if (isNothing2(maybe2))
                  return result;
                value12 = fromJust6(maybe2);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/index.js
  var fromJust2 = /* @__PURE__ */ fromJust();
  var unfoldable1Array = {
    unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
  };

  // output/Data.Unfoldable/index.js
  var fromJust3 = /* @__PURE__ */ fromJust();
  var unfoldr = function(dict) {
    return dict.unfoldr;
  };
  var unfoldableArray = {
    unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
    Unfoldable10: function() {
      return unfoldable1Array;
    }
  };

  // output/Data.Array/index.js
  var intercalate1 = /* @__PURE__ */ intercalate(foldableArray);
  var fromJust4 = /* @__PURE__ */ fromJust();
  var foldMap1 = /* @__PURE__ */ foldMap(foldableArray);
  var fold1 = /* @__PURE__ */ fold(foldableArray);
  var zipWith = /* @__PURE__ */ runFn3(zipWithImpl);
  var zip = /* @__PURE__ */ function() {
    return zipWith(Tuple.create);
  }();
  var snoc = function(xs) {
    return function(x) {
      return withArray(push(x))(xs)();
    };
  };
  var replicate = /* @__PURE__ */ runFn2(replicateImpl);
  var mapWithIndex2 = /* @__PURE__ */ mapWithIndex(functorWithIndexArray);
  var intercalate2 = function(dictMonoid) {
    return intercalate1(dictMonoid);
  };
  var fromFoldable = function(dictFoldable) {
    return runFn2(fromFoldableImpl)(foldr(dictFoldable));
  };
  var foldr2 = /* @__PURE__ */ foldr(foldableArray);
  var foldMap2 = function(dictMonoid) {
    return foldMap1(dictMonoid);
  };
  var fold2 = function(dictMonoid) {
    return fold1(dictMonoid);
  };
  var findIndex = /* @__PURE__ */ function() {
    return runFn4(findIndexImpl)(Just.create)(Nothing.value);
  }();
  var deleteAt = /* @__PURE__ */ function() {
    return runFn4(_deleteAt)(Just.create)(Nothing.value);
  }();
  var deleteBy = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2.length === 0) {
          return [];
        }
        ;
        return maybe(v2)(function(i2) {
          return fromJust4(deleteAt(i2)(v2));
        })(findIndex(v(v1))(v2));
      };
    };
  };

  // output/Halogen.Query.Input/index.js
  var RefUpdate = /* @__PURE__ */ function() {
    function RefUpdate2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RefUpdate2.create = function(value0) {
      return function(value1) {
        return new RefUpdate2(value0, value1);
      };
    };
    return RefUpdate2;
  }();
  var Action = /* @__PURE__ */ function() {
    function Action3(value0) {
      this.value0 = value0;
    }
    ;
    Action3.create = function(value0) {
      return new Action3(value0);
    };
    return Action3;
  }();

  // output/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a2, r, f) {
    return a2 == null ? r : f(a2);
  }
  function notNull(x) {
    return x;
  }

  // output/Data.Nullable/index.js
  var toNullable = /* @__PURE__ */ maybe(nullImpl)(notNull);
  var toMaybe = function(n) {
    return nullable(n, Nothing.value, Just.create);
  };

  // output/Halogen.VDom.Machine/index.js
  var Step = /* @__PURE__ */ function() {
    function Step3(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Step3.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Step3(value0, value1, value22, value32);
          };
        };
      };
    };
    return Step3;
  }();
  var unStep = unsafeCoerce2;
  var step = function(v, a2) {
    return v.value2(v.value1, a2);
  };
  var mkStep = unsafeCoerce2;
  var halt = function(v) {
    return v.value3(v.value1);
  };
  var extract2 = /* @__PURE__ */ unStep(function(v) {
    return v.value0;
  });

  // output/Halogen.VDom.Types/index.js
  var map6 = /* @__PURE__ */ map(functorArray);
  var map12 = /* @__PURE__ */ map(functorTuple);
  var Text = /* @__PURE__ */ function() {
    function Text2(value0) {
      this.value0 = value0;
    }
    ;
    Text2.create = function(value0) {
      return new Text2(value0);
    };
    return Text2;
  }();
  var Elem = /* @__PURE__ */ function() {
    function Elem2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Elem2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Elem2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Elem2;
  }();
  var Keyed = /* @__PURE__ */ function() {
    function Keyed2(value0, value1, value22, value32) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
    }
    ;
    Keyed2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return new Keyed2(value0, value1, value22, value32);
          };
        };
      };
    };
    return Keyed2;
  }();
  var Widget = /* @__PURE__ */ function() {
    function Widget2(value0) {
      this.value0 = value0;
    }
    ;
    Widget2.create = function(value0) {
      return new Widget2(value0);
    };
    return Widget2;
  }();
  var Grafted = /* @__PURE__ */ function() {
    function Grafted2(value0) {
      this.value0 = value0;
    }
    ;
    Grafted2.create = function(value0) {
      return new Grafted2(value0);
    };
    return Grafted2;
  }();
  var Graft = /* @__PURE__ */ function() {
    function Graft2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Graft2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Graft2(value0, value1, value22);
        };
      };
    };
    return Graft2;
  }();
  var unGraft = function(f) {
    return function($61) {
      return f($61);
    };
  };
  var graft = unsafeCoerce2;
  var bifunctorGraft = {
    bimap: function(f) {
      return function(g) {
        return unGraft(function(v) {
          return graft(new Graft(function($63) {
            return f(v.value0($63));
          }, function($64) {
            return g(v.value1($64));
          }, v.value2));
        });
      };
    }
  };
  var bimap2 = /* @__PURE__ */ bimap(bifunctorGraft);
  var runGraft = /* @__PURE__ */ unGraft(function(v) {
    var go2 = function(v2) {
      if (v2 instanceof Text) {
        return new Text(v2.value0);
      }
      ;
      if (v2 instanceof Elem) {
        return new Elem(v2.value0, v2.value1, v.value0(v2.value2), map6(go2)(v2.value3));
      }
      ;
      if (v2 instanceof Keyed) {
        return new Keyed(v2.value0, v2.value1, v.value0(v2.value2), map6(map12(go2))(v2.value3));
      }
      ;
      if (v2 instanceof Widget) {
        return new Widget(v.value1(v2.value0));
      }
      ;
      if (v2 instanceof Grafted) {
        return new Grafted(bimap2(v.value0)(v.value1)(v2.value0));
      }
      ;
      throw new Error("Failed pattern match at Halogen.VDom.Types (line 86, column 7 - line 86, column 27): " + [v2.constructor.name]);
    };
    return go2(v.value2);
  });

  // output/Halogen.VDom.Util/foreign.js
  function unsafeGetAny(key, obj) {
    return obj[key];
  }
  function unsafeHasAny(key, obj) {
    return obj.hasOwnProperty(key);
  }
  function unsafeSetAny(key, val, obj) {
    obj[key] = val;
  }
  function forE2(a2, f) {
    var b2 = [];
    for (var i2 = 0; i2 < a2.length; i2++) {
      b2.push(f(i2, a2[i2]));
    }
    return b2;
  }
  function forEachE(a2, f) {
    for (var i2 = 0; i2 < a2.length; i2++) {
      f(a2[i2]);
    }
  }
  function forInE(o, f) {
    var ks = Object.keys(o);
    for (var i2 = 0; i2 < ks.length; i2++) {
      var k = ks[i2];
      f(k, o[k]);
    }
  }
  function diffWithIxE(a1, a2, f1, f2, f3) {
    var a3 = [];
    var l1 = a1.length;
    var l2 = a2.length;
    var i2 = 0;
    while (1) {
      if (i2 < l1) {
        if (i2 < l2) {
          a3.push(f1(i2, a1[i2], a2[i2]));
        } else {
          f2(i2, a1[i2]);
        }
      } else if (i2 < l2) {
        a3.push(f3(i2, a2[i2]));
      } else {
        break;
      }
      i2++;
    }
    return a3;
  }
  function strMapWithIxE(as, fk, f) {
    var o = {};
    for (var i2 = 0; i2 < as.length; i2++) {
      var a2 = as[i2];
      var k = fk(a2);
      o[k] = f(k, i2, a2);
    }
    return o;
  }
  function diffWithKeyAndIxE(o1, as, fk, f1, f2, f3) {
    var o2 = {};
    for (var i2 = 0; i2 < as.length; i2++) {
      var a2 = as[i2];
      var k = fk(a2);
      if (o1.hasOwnProperty(k)) {
        o2[k] = f1(k, i2, o1[k], a2);
      } else {
        o2[k] = f3(k, i2, a2);
      }
    }
    for (var k in o1) {
      if (k in o2) {
        continue;
      }
      f2(k, o1[k]);
    }
    return o2;
  }
  function refEq2(a2, b2) {
    return a2 === b2;
  }
  function createTextNode(s, doc) {
    return doc.createTextNode(s);
  }
  function setTextContent(s, n) {
    n.textContent = s;
  }
  function createElement(ns, name16, doc) {
    if (ns != null) {
      return doc.createElementNS(ns, name16);
    } else {
      return doc.createElement(name16);
    }
  }
  function insertChildIx(i2, a2, b2) {
    var n = b2.childNodes.item(i2) || null;
    if (n !== a2) {
      b2.insertBefore(a2, n);
    }
  }
  function removeChild(a2, b2) {
    if (b2 && a2.parentNode === b2) {
      b2.removeChild(a2);
    }
  }
  function parentNode(a2) {
    return a2.parentNode;
  }
  function setAttribute(ns, attr3, val, el) {
    if (ns != null) {
      el.setAttributeNS(ns, attr3, val);
    } else {
      el.setAttribute(attr3, val);
    }
  }
  function removeAttribute(ns, attr3, el) {
    if (ns != null) {
      el.removeAttributeNS(ns, attr3);
    } else {
      el.removeAttribute(attr3);
    }
  }
  function hasAttribute(ns, attr3, el) {
    if (ns != null) {
      return el.hasAttributeNS(ns, attr3);
    } else {
      return el.hasAttribute(attr3);
    }
  }
  function addEventListener(ev, listener, el) {
    el.addEventListener(ev, listener, false);
  }
  function removeEventListener(ev, listener, el) {
    el.removeEventListener(ev, listener, false);
  }
  var jsUndefined = void 0;

  // output/Foreign.Object.ST/foreign.js
  var newImpl = function() {
    return {};
  };

  // output/Halogen.VDom.Util/index.js
  var unsafeLookup = unsafeGetAny;
  var unsafeFreeze2 = unsafeCoerce2;
  var pokeMutMap = unsafeSetAny;
  var newMutMap = newImpl;

  // output/Web.DOM.Element/foreign.js
  var getProp = function(name16) {
    return function(doctype) {
      return doctype[name16];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");

  // output/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name16) {
    return function(node) {
      return function() {
        return node[name16];
      };
    };
  };
  var children = getEffProp("children");
  var _firstElementChild = getEffProp("firstElementChild");
  var _lastElementChild = getEffProp("lastElementChild");
  var childElementCount = getEffProp("childElementCount");
  function _querySelector(selector) {
    return function(node) {
      return function() {
        return node.querySelector(selector);
      };
    };
  }

  // output/Web.DOM.ParentNode/index.js
  var map7 = /* @__PURE__ */ map(functorEffect);
  var querySelector = function(qs) {
    var $2 = map7(toMaybe);
    var $3 = _querySelector(qs);
    return function($4) {
      return $2($3($4));
    };
  };

  // output/Web.DOM.Element/index.js
  var toNode = unsafeCoerce2;

  // output/Halogen.VDom.DOM/index.js
  var $runtime_lazy3 = function(name16, moduleName, init2) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init2();
      state3 = 2;
      return val;
    };
  };
  var haltWidget = function(v) {
    return halt(v.widget);
  };
  var $lazy_patchWidget = /* @__PURE__ */ $runtime_lazy3("patchWidget", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchWidget(291)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Widget) {
        var res = step(state3.widget, vdom.value0);
        var res$prime = unStep(function(v) {
          return mkStep(new Step(v.value0, {
            build: state3.build,
            widget: res
          }, $lazy_patchWidget(296), haltWidget));
        })(res);
        return res$prime;
      }
      ;
      haltWidget(state3);
      return state3.build(vdom);
    };
  });
  var patchWidget = /* @__PURE__ */ $lazy_patchWidget(286);
  var haltText = function(v) {
    var parent2 = parentNode(v.node);
    return removeChild(v.node, parent2);
  };
  var $lazy_patchText = /* @__PURE__ */ $runtime_lazy3("patchText", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchText(82)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Text) {
        if (state3.value === vdom.value0) {
          return mkStep(new Step(state3.node, state3, $lazy_patchText(85), haltText));
        }
        ;
        if (otherwise) {
          var nextState = {
            build: state3.build,
            node: state3.node,
            value: vdom.value0
          };
          setTextContent(vdom.value0, state3.node);
          return mkStep(new Step(state3.node, nextState, $lazy_patchText(89), haltText));
        }
        ;
      }
      ;
      haltText(state3);
      return state3.build(vdom);
    };
  });
  var patchText = /* @__PURE__ */ $lazy_patchText(77);
  var haltKeyed = function(v) {
    var parent2 = parentNode(v.node);
    removeChild(v.node, parent2);
    forInE(v.children, function(v1, s) {
      return halt(s);
    });
    return halt(v.attrs);
  };
  var haltElem = function(v) {
    var parent2 = parentNode(v.node);
    removeChild(v.node, parent2);
    forEachE(v.children, halt);
    return halt(v.attrs);
  };
  var eqElemSpec = function(ns1, v, ns2, v1) {
    var $63 = v === v1;
    if ($63) {
      if (ns1 instanceof Just && (ns2 instanceof Just && ns1.value0 === ns2.value0)) {
        return true;
      }
      ;
      if (ns1 instanceof Nothing && ns2 instanceof Nothing) {
        return true;
      }
      ;
      return false;
    }
    ;
    return false;
  };
  var $lazy_patchElem = /* @__PURE__ */ $runtime_lazy3("patchElem", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchElem(135)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Elem && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
        var v = length(vdom.value3);
        var v1 = length(state3.children);
        if (v1 === 0 && v === 0) {
          var attrs2 = step(state3.attrs, vdom.value2);
          var nextState = {
            build: state3.build,
            node: state3.node,
            attrs: attrs2,
            ns: vdom.value0,
            name: vdom.value1,
            children: state3.children
          };
          return mkStep(new Step(state3.node, nextState, $lazy_patchElem(149), haltElem));
        }
        ;
        var onThis = function(v2, s) {
          return halt(s);
        };
        var onThese = function(ix, s, v2) {
          var res = step(s, v2);
          insertChildIx(ix, extract2(res), state3.node);
          return res;
        };
        var onThat = function(ix, v2) {
          var res = state3.build(v2);
          insertChildIx(ix, extract2(res), state3.node);
          return res;
        };
        var children2 = diffWithIxE(state3.children, vdom.value3, onThese, onThis, onThat);
        var attrs2 = step(state3.attrs, vdom.value2);
        var nextState = {
          build: state3.build,
          node: state3.node,
          attrs: attrs2,
          ns: vdom.value0,
          name: vdom.value1,
          children: children2
        };
        return mkStep(new Step(state3.node, nextState, $lazy_patchElem(172), haltElem));
      }
      ;
      haltElem(state3);
      return state3.build(vdom);
    };
  });
  var patchElem = /* @__PURE__ */ $lazy_patchElem(130);
  var $lazy_patchKeyed = /* @__PURE__ */ $runtime_lazy3("patchKeyed", "Halogen.VDom.DOM", function() {
    return function(state3, vdom) {
      if (vdom instanceof Grafted) {
        return $lazy_patchKeyed(222)(state3, runGraft(vdom.value0));
      }
      ;
      if (vdom instanceof Keyed && eqElemSpec(state3.ns, state3.name, vdom.value0, vdom.value1)) {
        var v = length(vdom.value3);
        if (state3.length === 0 && v === 0) {
          var attrs2 = step(state3.attrs, vdom.value2);
          var nextState = {
            build: state3.build,
            node: state3.node,
            attrs: attrs2,
            ns: vdom.value0,
            name: vdom.value1,
            children: state3.children,
            length: 0
          };
          return mkStep(new Step(state3.node, nextState, $lazy_patchKeyed(237), haltKeyed));
        }
        ;
        var onThis = function(v2, s) {
          return halt(s);
        };
        var onThese = function(v2, ix$prime, s, v3) {
          var res = step(s, v3.value1);
          insertChildIx(ix$prime, extract2(res), state3.node);
          return res;
        };
        var onThat = function(v2, ix, v3) {
          var res = state3.build(v3.value1);
          insertChildIx(ix, extract2(res), state3.node);
          return res;
        };
        var children2 = diffWithKeyAndIxE(state3.children, vdom.value3, fst, onThese, onThis, onThat);
        var attrs2 = step(state3.attrs, vdom.value2);
        var nextState = {
          build: state3.build,
          node: state3.node,
          attrs: attrs2,
          ns: vdom.value0,
          name: vdom.value1,
          children: children2,
          length: v
        };
        return mkStep(new Step(state3.node, nextState, $lazy_patchKeyed(261), haltKeyed));
      }
      ;
      haltKeyed(state3);
      return state3.build(vdom);
    };
  });
  var patchKeyed = /* @__PURE__ */ $lazy_patchKeyed(217);
  var buildWidget = function(v, build, w) {
    var res = v.buildWidget(v)(w);
    var res$prime = unStep(function(v1) {
      return mkStep(new Step(v1.value0, {
        build,
        widget: res
      }, patchWidget, haltWidget));
    })(res);
    return res$prime;
  };
  var buildText = function(v, build, s) {
    var node = createTextNode(s, v.document);
    var state3 = {
      build,
      node,
      value: s
    };
    return mkStep(new Step(node, state3, patchText, haltText));
  };
  var buildKeyed = function(v, build, ns1, name1, as1, ch1) {
    var el = createElement(toNullable(ns1), name1, v.document);
    var node = toNode(el);
    var onChild = function(v1, ix, v2) {
      var res = build(v2.value1);
      insertChildIx(ix, extract2(res), node);
      return res;
    };
    var children2 = strMapWithIxE(ch1, fst, onChild);
    var attrs = v.buildAttributes(el)(as1);
    var state3 = {
      build,
      node,
      attrs,
      ns: ns1,
      name: name1,
      children: children2,
      length: length(ch1)
    };
    return mkStep(new Step(node, state3, patchKeyed, haltKeyed));
  };
  var buildElem = function(v, build, ns1, name1, as1, ch1) {
    var el = createElement(toNullable(ns1), name1, v.document);
    var node = toNode(el);
    var onChild = function(ix, child) {
      var res = build(child);
      insertChildIx(ix, extract2(res), node);
      return res;
    };
    var children2 = forE2(ch1, onChild);
    var attrs = v.buildAttributes(el)(as1);
    var state3 = {
      build,
      node,
      attrs,
      ns: ns1,
      name: name1,
      children: children2
    };
    return mkStep(new Step(node, state3, patchElem, haltElem));
  };
  var buildVDom = function(spec) {
    var $lazy_build = $runtime_lazy3("build", "Halogen.VDom.DOM", function() {
      return function(v) {
        if (v instanceof Text) {
          return buildText(spec, $lazy_build(59), v.value0);
        }
        ;
        if (v instanceof Elem) {
          return buildElem(spec, $lazy_build(60), v.value0, v.value1, v.value2, v.value3);
        }
        ;
        if (v instanceof Keyed) {
          return buildKeyed(spec, $lazy_build(61), v.value0, v.value1, v.value2, v.value3);
        }
        ;
        if (v instanceof Widget) {
          return buildWidget(spec, $lazy_build(62), v.value0);
        }
        ;
        if (v instanceof Grafted) {
          return $lazy_build(63)(runGraft(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Halogen.VDom.DOM (line 58, column 27 - line 63, column 52): " + [v.constructor.name]);
      };
    });
    var build = $lazy_build(58);
    return build;
  };

  // output/Foreign/foreign.js
  function typeOf(value12) {
    return typeof value12;
  }
  var isArray = Array.isArray || function(value12) {
    return Object.prototype.toString.call(value12) === "[object Array]";
  };

  // output/Data.Int/foreign.js
  var fromStringAsImpl = function(just) {
    return function(nothing) {
      return function(radix) {
        var digits;
        if (radix < 11) {
          digits = "[0-" + (radix - 1).toString() + "]";
        } else if (radix === 11) {
          digits = "[0-9a]";
        } else {
          digits = "[0-9a-" + String.fromCharCode(86 + radix) + "]";
        }
        var pattern2 = new RegExp("^[\\+\\-]?" + digits + "+$", "i");
        return function(s) {
          if (pattern2.test(s)) {
            var i2 = parseInt(s, radix);
            return (i2 | 0) === i2 ? just(i2) : nothing;
          } else {
            return nothing;
          }
        };
      };
    };
  };

  // output/Data.Int/index.js
  var fromStringAs = /* @__PURE__ */ function() {
    return fromStringAsImpl(Just.create)(Nothing.value);
  }();
  var fromString = /* @__PURE__ */ fromStringAs(10);

  // output/Data.NonEmpty/index.js
  var NonEmpty = /* @__PURE__ */ function() {
    function NonEmpty2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    NonEmpty2.create = function(value0) {
      return function(value1) {
        return new NonEmpty2(value0, value1);
      };
    };
    return NonEmpty2;
  }();
  var singleton2 = function(dictPlus) {
    var empty8 = empty(dictPlus);
    return function(a2) {
      return new NonEmpty(a2, empty8);
    };
  };

  // output/Data.List.Types/index.js
  var identity9 = /* @__PURE__ */ identity(categoryFn);
  var Nil = /* @__PURE__ */ function() {
    function Nil2() {
    }
    ;
    Nil2.value = new Nil2();
    return Nil2;
  }();
  var Cons = /* @__PURE__ */ function() {
    function Cons2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Cons2.create = function(value0) {
      return function(value1) {
        return new Cons2(value0, value1);
      };
    };
    return Cons2;
  }();
  var NonEmptyList = function(x) {
    return x;
  };
  var listMap = function(f) {
    var chunkedRevMap = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1) {
          if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Cons)) {
            $tco_var_v = new Cons(v1, v);
            $copy_v1 = v1.value1.value1.value1;
            return;
          }
          ;
          var unrolledMap = function(v2) {
            if (v2 instanceof Cons && (v2.value1 instanceof Cons && v2.value1.value1 instanceof Nil)) {
              return new Cons(f(v2.value0), new Cons(f(v2.value1.value0), Nil.value));
            }
            ;
            if (v2 instanceof Cons && v2.value1 instanceof Nil) {
              return new Cons(f(v2.value0), Nil.value);
            }
            ;
            return Nil.value;
          };
          var reverseUnrolledMap = function($copy_v2) {
            return function($copy_v3) {
              var $tco_var_v2 = $copy_v2;
              var $tco_done1 = false;
              var $tco_result2;
              function $tco_loop2(v2, v3) {
                if (v2 instanceof Cons && (v2.value0 instanceof Cons && (v2.value0.value1 instanceof Cons && v2.value0.value1.value1 instanceof Cons))) {
                  $tco_var_v2 = v2.value1;
                  $copy_v3 = new Cons(f(v2.value0.value0), new Cons(f(v2.value0.value1.value0), new Cons(f(v2.value0.value1.value1.value0), v3)));
                  return;
                }
                ;
                $tco_done1 = true;
                return v3;
              }
              ;
              while (!$tco_done1) {
                $tco_result2 = $tco_loop2($tco_var_v2, $copy_v3);
              }
              ;
              return $tco_result2;
            };
          };
          $tco_done = true;
          return reverseUnrolledMap(v)(unrolledMap(v1));
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
    return chunkedRevMap(Nil.value);
  };
  var functorList = {
    map: listMap
  };
  var map8 = /* @__PURE__ */ map(functorList);
  var foldableList = {
    foldr: function(f) {
      return function(b2) {
        var rev3 = function() {
          var go2 = function($copy_v) {
            return function($copy_v1) {
              var $tco_var_v = $copy_v;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v, v1) {
                if (v1 instanceof Nil) {
                  $tco_done = true;
                  return v;
                }
                ;
                if (v1 instanceof Cons) {
                  $tco_var_v = new Cons(v1.value0, v);
                  $copy_v1 = v1.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v.constructor.name, v1.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $copy_v1);
              }
              ;
              return $tco_result;
            };
          };
          return go2(Nil.value);
        }();
        var $284 = foldl(foldableList)(flip(f))(b2);
        return function($285) {
          return $284(rev3($285));
        };
      };
    },
    foldl: function(f) {
      var go2 = function($copy_b) {
        return function($copy_v) {
          var $tco_var_b = $copy_b;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(b2, v) {
            if (v instanceof Nil) {
              $tco_done1 = true;
              return b2;
            }
            ;
            if (v instanceof Cons) {
              $tco_var_b = f(b2)(v.value0);
              $copy_v = v.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_b, $copy_v);
          }
          ;
          return $tco_result;
        };
      };
      return go2;
    },
    foldMap: function(dictMonoid) {
      var append23 = append(dictMonoid.Semigroup0());
      var mempty4 = mempty(dictMonoid);
      return function(f) {
        return foldl(foldableList)(function(acc) {
          var $286 = append23(acc);
          return function($287) {
            return $286(f($287));
          };
        })(mempty4);
      };
    }
  };
  var foldl2 = /* @__PURE__ */ foldl(foldableList);
  var foldr3 = /* @__PURE__ */ foldr(foldableList);
  var intercalate3 = /* @__PURE__ */ intercalate(foldableList)(monoidString);
  var semigroupList = {
    append: function(xs) {
      return function(ys) {
        return foldr3(Cons.create)(ys)(xs);
      };
    }
  };
  var append1 = /* @__PURE__ */ append(semigroupList);
  var monoidList = /* @__PURE__ */ function() {
    return {
      mempty: Nil.value,
      Semigroup0: function() {
        return semigroupList;
      }
    };
  }();
  var showList = function(dictShow) {
    var show11 = show(dictShow);
    return {
      show: function(v) {
        if (v instanceof Nil) {
          return "Nil";
        }
        ;
        return "(" + (intercalate3(" : ")(map8(show11)(v)) + " : Nil)");
      }
    };
  };
  var traversableList = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var map112 = map(Apply0.Functor0());
      var lift22 = lift2(Apply0);
      var pure110 = pure(dictApplicative);
      return function(f) {
        var $301 = map112(foldl2(flip(Cons.create))(Nil.value));
        var $302 = foldl2(function(acc) {
          var $304 = lift22(flip(Cons.create))(acc);
          return function($305) {
            return $304(f($305));
          };
        })(pure110(Nil.value));
        return function($303) {
          return $301($302($303));
        };
      };
    },
    sequence: function(dictApplicative) {
      return traverse(traversableList)(dictApplicative)(identity9);
    },
    Functor0: function() {
      return functorList;
    },
    Foldable1: function() {
      return foldableList;
    }
  };
  var applyList = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Nil) {
          return Nil.value;
        }
        ;
        if (v instanceof Cons) {
          return append1(map8(v.value0)(v1))(apply(applyList)(v.value1)(v1));
        }
        ;
        throw new Error("Failed pattern match at Data.List.Types (line 157, column 1 - line 159, column 48): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorList;
    }
  };
  var applicativeList = {
    pure: function(a2) {
      return new Cons(a2, Nil.value);
    },
    Apply0: function() {
      return applyList;
    }
  };
  var altList = {
    alt: append1,
    Functor0: function() {
      return functorList;
    }
  };
  var plusList = /* @__PURE__ */ function() {
    return {
      empty: Nil.value,
      Alt0: function() {
        return altList;
      }
    };
  }();

  // output/Data.List/index.js
  var foldr4 = /* @__PURE__ */ foldr(foldableList);
  var snoc2 = function(xs) {
    return function(x) {
      return foldr4(Cons.create)(new Cons(x, Nil.value))(xs);
    };
  };
  var singleton3 = function(a2) {
    return new Cons(a2, Nil.value);
  };
  var reverse2 = /* @__PURE__ */ function() {
    var go2 = function($copy_v) {
      return function($copy_v1) {
        var $tco_var_v = $copy_v;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1) {
          if (v1 instanceof Nil) {
            $tco_done = true;
            return v;
          }
          ;
          if (v1 instanceof Cons) {
            $tco_var_v = new Cons(v1.value0, v);
            $copy_v1 = v1.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List (line 368, column 3 - line 368, column 19): " + [v.constructor.name, v1.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $copy_v1);
        }
        ;
        return $tco_result;
      };
    };
    return go2(Nil.value);
  }();
  var $$null = function(v) {
    if (v instanceof Nil) {
      return true;
    }
    ;
    return false;
  };
  var fromFoldable2 = function(dictFoldable) {
    return foldr(dictFoldable)(Cons.create)(Nil.value);
  };
  var foldM = function(dictMonad) {
    var pure21 = pure(dictMonad.Applicative0());
    var bind15 = bind(dictMonad.Bind1());
    return function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Nil) {
            return pure21(v1);
          }
          ;
          if (v2 instanceof Cons) {
            return bind15(v(v1)(v2.value0))(function(b$prime) {
              return foldM(dictMonad)(v)(b$prime)(v2.value1);
            });
          }
          ;
          throw new Error("Failed pattern match at Data.List (line 824, column 1 - line 824, column 72): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    };
  };
  var filterM = function(dictMonad) {
    var pure21 = pure(dictMonad.Applicative0());
    var bind15 = bind(dictMonad.Bind1());
    return function(v) {
      return function(v1) {
        if (v1 instanceof Nil) {
          return pure21(Nil.value);
        }
        ;
        if (v1 instanceof Cons) {
          return bind15(v(v1.value0))(function(b2) {
            return bind15(filterM(dictMonad)(v)(v1.value1))(function(xs$prime) {
              return pure21(function() {
                if (b2) {
                  return new Cons(v1.value0, xs$prime);
                }
                ;
                return xs$prime;
              }());
            });
          });
        }
        ;
        throw new Error("Failed pattern match at Data.List (line 403, column 1 - line 403, column 75): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };

  // output/Data.List.NonEmpty/index.js
  var singleton4 = /* @__PURE__ */ function() {
    var $200 = singleton2(plusList);
    return function($201) {
      return NonEmptyList($200($201));
    };
  }();
  var cons = function(y) {
    return function(v) {
      return new NonEmpty(y, new Cons(v.value0, v.value1));
    };
  };

  // output/Data.String.CodeUnits/foreign.js
  var fromCharArray = function(a2) {
    return a2.join("");
  };

  // output/Foreign.Object/foreign.js
  function _fmapObject(m0, f) {
    var m = {};
    for (var k in m0) {
      if (hasOwnProperty.call(m0, k)) {
        m[k] = f(m0[k]);
      }
    }
    return m;
  }
  function _lookup(no, yes, k, m) {
    return k in m ? yes(m[k]) : no;
  }
  function toArrayWithKey(f) {
    return function(m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
  var keys = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output/Foreign.Object/index.js
  var lookup = /* @__PURE__ */ function() {
    return runFn4(_lookup)(Nothing.value)(Just.create);
  }();
  var functorObject = {
    map: function(f) {
      return function(m) {
        return _fmapObject(m, f);
      };
    }
  };

  // output/Web.Event.EventTarget/foreign.js
  function eventListener(fn) {
    return function() {
      return function(event) {
        return fn(event)();
      };
    };
  }
  function addEventListener2(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target6) {
          return function() {
            return target6.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }
  function removeEventListener2(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target6) {
          return function() {
            return target6.removeEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output/Halogen.VDom.DOM.Prop/index.js
  var $runtime_lazy4 = function(name16, moduleName, init2) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init2();
      state3 = 2;
      return val;
    };
  };
  var Created = /* @__PURE__ */ function() {
    function Created2(value0) {
      this.value0 = value0;
    }
    ;
    Created2.create = function(value0) {
      return new Created2(value0);
    };
    return Created2;
  }();
  var Removed = /* @__PURE__ */ function() {
    function Removed2(value0) {
      this.value0 = value0;
    }
    ;
    Removed2.create = function(value0) {
      return new Removed2(value0);
    };
    return Removed2;
  }();
  var Attribute = /* @__PURE__ */ function() {
    function Attribute2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Attribute2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Attribute2(value0, value1, value22);
        };
      };
    };
    return Attribute2;
  }();
  var Property = /* @__PURE__ */ function() {
    function Property2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Property2.create = function(value0) {
      return function(value1) {
        return new Property2(value0, value1);
      };
    };
    return Property2;
  }();
  var Handler = /* @__PURE__ */ function() {
    function Handler2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Handler2.create = function(value0) {
      return function(value1) {
        return new Handler2(value0, value1);
      };
    };
    return Handler2;
  }();
  var Ref = /* @__PURE__ */ function() {
    function Ref2(value0) {
      this.value0 = value0;
    }
    ;
    Ref2.create = function(value0) {
      return new Ref2(value0);
    };
    return Ref2;
  }();
  var unsafeGetProperty = unsafeGetAny;
  var setProperty = unsafeSetAny;
  var removeProperty = function(key, el) {
    var v = hasAttribute(nullImpl, key, el);
    if (v) {
      return removeAttribute(nullImpl, key, el);
    }
    ;
    var v1 = typeOf(unsafeGetAny(key, el));
    if (v1 === "string") {
      return unsafeSetAny(key, "", el);
    }
    ;
    if (key === "rowSpan") {
      return unsafeSetAny(key, 1, el);
    }
    ;
    if (key === "colSpan") {
      return unsafeSetAny(key, 1, el);
    }
    ;
    return unsafeSetAny(key, jsUndefined, el);
  };
  var propToStrKey = function(v) {
    if (v instanceof Attribute && v.value0 instanceof Just) {
      return "attr/" + (v.value0.value0 + (":" + v.value1));
    }
    ;
    if (v instanceof Attribute) {
      return "attr/:" + v.value1;
    }
    ;
    if (v instanceof Property) {
      return "prop/" + v.value0;
    }
    ;
    if (v instanceof Handler) {
      return "handler/" + v.value0;
    }
    ;
    if (v instanceof Ref) {
      return "ref";
    }
    ;
    throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 182, column 16 - line 187, column 16): " + [v.constructor.name]);
  };
  var buildProp = function(emit) {
    return function(el) {
      var removeProp = function(prevEvents) {
        return function(v, v1) {
          if (v1 instanceof Attribute) {
            return removeAttribute(toNullable(v1.value0), v1.value1, el);
          }
          ;
          if (v1 instanceof Property) {
            return removeProperty(v1.value0, el);
          }
          ;
          if (v1 instanceof Handler) {
            var handler3 = unsafeLookup(v1.value0, prevEvents);
            return removeEventListener(v1.value0, fst(handler3), el);
          }
          ;
          if (v1 instanceof Ref) {
            return unit;
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 169, column 5 - line 179, column 18): " + [v1.constructor.name]);
        };
      };
      var mbEmit = function(v) {
        if (v instanceof Just) {
          return emit(v.value0)();
        }
        ;
        return unit;
      };
      var haltProp = function(state3) {
        var v = lookup("ref")(state3.props);
        if (v instanceof Just && v.value0 instanceof Ref) {
          return mbEmit(v.value0.value0(new Removed(el)));
        }
        ;
        return unit;
      };
      var diffProp = function(prevEvents, events) {
        return function(v, v1, v11, v2) {
          if (v11 instanceof Attribute && v2 instanceof Attribute) {
            var $66 = v11.value2 === v2.value2;
            if ($66) {
              return v2;
            }
            ;
            setAttribute(toNullable(v2.value0), v2.value1, v2.value2, el);
            return v2;
          }
          ;
          if (v11 instanceof Property && v2 instanceof Property) {
            var v4 = refEq2(v11.value1, v2.value1);
            if (v4) {
              return v2;
            }
            ;
            if (v2.value0 === "value") {
              var elVal = unsafeGetProperty("value", el);
              var $75 = refEq2(elVal, v2.value1);
              if ($75) {
                return v2;
              }
              ;
              setProperty(v2.value0, v2.value1, el);
              return v2;
            }
            ;
            setProperty(v2.value0, v2.value1, el);
            return v2;
          }
          ;
          if (v11 instanceof Handler && v2 instanceof Handler) {
            var handler3 = unsafeLookup(v2.value0, prevEvents);
            write(v2.value1)(snd(handler3))();
            pokeMutMap(v2.value0, handler3, events);
            return v2;
          }
          ;
          return v2;
        };
      };
      var applyProp = function(events) {
        return function(v, v1, v2) {
          if (v2 instanceof Attribute) {
            setAttribute(toNullable(v2.value0), v2.value1, v2.value2, el);
            return v2;
          }
          ;
          if (v2 instanceof Property) {
            setProperty(v2.value0, v2.value1, el);
            return v2;
          }
          ;
          if (v2 instanceof Handler) {
            var v3 = unsafeGetAny(v2.value0, events);
            if (unsafeHasAny(v2.value0, events)) {
              write(v2.value1)(snd(v3))();
              return v2;
            }
            ;
            var ref2 = $$new(v2.value1)();
            var listener = eventListener(function(ev) {
              return function __do2() {
                var f$prime = read(ref2)();
                return mbEmit(f$prime(ev));
              };
            })();
            pokeMutMap(v2.value0, new Tuple(listener, ref2), events);
            addEventListener(v2.value0, listener, el);
            return v2;
          }
          ;
          if (v2 instanceof Ref) {
            mbEmit(v2.value0(new Created(el)));
            return v2;
          }
          ;
          throw new Error("Failed pattern match at Halogen.VDom.DOM.Prop (line 113, column 5 - line 135, column 15): " + [v2.constructor.name]);
        };
      };
      var $lazy_patchProp = $runtime_lazy4("patchProp", "Halogen.VDom.DOM.Prop", function() {
        return function(state3, ps2) {
          var events = newMutMap();
          var onThis = removeProp(state3.events);
          var onThese = diffProp(state3.events, events);
          var onThat = applyProp(events);
          var props = diffWithKeyAndIxE(state3.props, ps2, propToStrKey, onThese, onThis, onThat);
          var nextState = {
            events: unsafeFreeze2(events),
            props
          };
          return mkStep(new Step(unit, nextState, $lazy_patchProp(100), haltProp));
        };
      });
      var patchProp = $lazy_patchProp(87);
      var renderProp = function(ps1) {
        var events = newMutMap();
        var ps1$prime = strMapWithIxE(ps1, propToStrKey, applyProp(events));
        var state3 = {
          events: unsafeFreeze2(events),
          props: ps1$prime
        };
        return mkStep(new Step(unit, state3, patchProp, haltProp));
      };
      return renderProp;
    };
  };

  // output/Halogen.HTML.Core/index.js
  var HTML = function(x) {
    return x;
  };
  var widget = function($28) {
    return HTML(Widget.create($28));
  };
  var text = function($29) {
    return HTML(Text.create($29));
  };
  var handler = /* @__PURE__ */ function() {
    return Handler.create;
  }();
  var element = function(ns) {
    return function(name16) {
      return function(props) {
        return function(children2) {
          return new Elem(ns, name16, props, children2);
        };
      };
    };
  };
  var attr = function(ns) {
    return function(v) {
      return Attribute.create(ns)(v);
    };
  };

  // output/Halogen.HTML.Properties/index.js
  var attr2 = /* @__PURE__ */ function() {
    return attr(Nothing.value);
  }();
  var style = /* @__PURE__ */ attr2("style");

  // output/Foliage.App.Style/index.js
  var append12 = /* @__PURE__ */ append(semigroupArray);
  var underline = ["text-decoration: underline"];
  var style2 = /* @__PURE__ */ function() {
    var $5 = foldMap2(monoidString)(function(v) {
      return v + "; ";
    });
    return function($6) {
      return style($5($6));
    };
  }();
  var rounded = ["border-radius: 0.5em"];
  var padding_small = ["padding: 0.5em"];
  var padding_horizontal_big = ["padding: 0 1.0em"];
  var padding_big = ["padding: 1em"];
  var margin_small = ["margin: 0.5em"];
  var italic = ["font-style: italic"];
  var horizontal_bar = ["width: 100%", "height: 2px", "background-color: black", "border-radius: 50px"];
  var font_prose = ["font-family: serif"];
  var font_fancy = ["font-family: cursive"];
  var font_code = ["font-family: monospace"];
  var flex_row = ["display: flex", "flex-direction: row", "gap: 0.5em"];
  var flex_column = ["display: flex", "flex-direction: column", "gap: 0.5em"];
  var color_error = ["color: red"];
  var button = /* @__PURE__ */ append12(rounded)(["border: none", "background-color: black", "color: white", "padding: 0.2em 0.8em", "user-select: none"]);
  var boundaries = /* @__PURE__ */ append12(rounded)(["box-shadow: 0.1em 0 0 0 rgba(0, 0, 0, 0.5) inset"]);
  var bold = ["font-weight: bold"];

  // output/Data.Exists/index.js
  var runExists = unsafeCoerce2;
  var mkExists = unsafeCoerce2;

  // output/Data.Coyoneda/index.js
  var CoyonedaF = /* @__PURE__ */ function() {
    function CoyonedaF2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CoyonedaF2.create = function(value0) {
      return function(value1) {
        return new CoyonedaF2(value0, value1);
      };
    };
    return CoyonedaF2;
  }();
  var unCoyoneda = function(f) {
    return function(v) {
      return runExists(function(v1) {
        return f(v1.value0)(v1.value1);
      })(v);
    };
  };
  var coyoneda = function(k) {
    return function(fi) {
      return mkExists(new CoyonedaF(k, fi));
    };
  };
  var functorCoyoneda = {
    map: function(f) {
      return function(v) {
        return runExists(function(v1) {
          return coyoneda(function($180) {
            return f(v1.value0($180));
          })(v1.value1);
        })(v);
      };
    }
  };
  var liftCoyoneda = /* @__PURE__ */ coyoneda(/* @__PURE__ */ identity(categoryFn));

  // output/Data.Map.Internal/index.js
  var $runtime_lazy5 = function(name16, moduleName, init2) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init2();
      state3 = 2;
      return val;
    };
  };
  var map9 = /* @__PURE__ */ map(functorMaybe);
  var Leaf = /* @__PURE__ */ function() {
    function Leaf2() {
    }
    ;
    Leaf2.value = new Leaf2();
    return Leaf2;
  }();
  var Node = /* @__PURE__ */ function() {
    function Node2(value0, value1, value22, value32, value42, value52) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
      this.value3 = value32;
      this.value4 = value42;
      this.value5 = value52;
    }
    ;
    Node2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return function(value32) {
            return function(value42) {
              return function(value52) {
                return new Node2(value0, value1, value22, value32, value42, value52);
              };
            };
          };
        };
      };
    };
    return Node2;
  }();
  var IterLeaf = /* @__PURE__ */ function() {
    function IterLeaf2() {
    }
    ;
    IterLeaf2.value = new IterLeaf2();
    return IterLeaf2;
  }();
  var IterEmit = /* @__PURE__ */ function() {
    function IterEmit2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    IterEmit2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new IterEmit2(value0, value1, value22);
        };
      };
    };
    return IterEmit2;
  }();
  var IterNode = /* @__PURE__ */ function() {
    function IterNode2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    IterNode2.create = function(value0) {
      return function(value1) {
        return new IterNode2(value0, value1);
      };
    };
    return IterNode2;
  }();
  var Split = /* @__PURE__ */ function() {
    function Split2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    Split2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new Split2(value0, value1, value22);
        };
      };
    };
    return Split2;
  }();
  var SplitLast = /* @__PURE__ */ function() {
    function SplitLast2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    SplitLast2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new SplitLast2(value0, value1, value22);
        };
      };
    };
    return SplitLast2;
  }();
  var unsafeNode = function(k, v, l, r) {
    if (l instanceof Leaf) {
      if (r instanceof Leaf) {
        return new Node(1, 1, k, v, l, r);
      }
      ;
      if (r instanceof Node) {
        return new Node(1 + r.value0 | 0, 1 + r.value1 | 0, k, v, l, r);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 702, column 5 - line 706, column 39): " + [r.constructor.name]);
    }
    ;
    if (l instanceof Node) {
      if (r instanceof Leaf) {
        return new Node(1 + l.value0 | 0, 1 + l.value1 | 0, k, v, l, r);
      }
      ;
      if (r instanceof Node) {
        return new Node(1 + function() {
          var $280 = l.value0 > r.value0;
          if ($280) {
            return l.value0;
          }
          ;
          return r.value0;
        }() | 0, (1 + l.value1 | 0) + r.value1 | 0, k, v, l, r);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 708, column 5 - line 712, column 68): " + [r.constructor.name]);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 700, column 32 - line 712, column 68): " + [l.constructor.name]);
  };
  var toMapIter = /* @__PURE__ */ function() {
    return flip(IterNode.create)(IterLeaf.value);
  }();
  var stepWith = function(f) {
    return function(next) {
      return function(done) {
        var go2 = function($copy_v) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v) {
            if (v instanceof IterLeaf) {
              $tco_done = true;
              return done(unit);
            }
            ;
            if (v instanceof IterEmit) {
              $tco_done = true;
              return next(v.value0, v.value1, v.value2);
            }
            ;
            if (v instanceof IterNode) {
              $copy_v = f(v.value1)(v.value0);
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 940, column 8 - line 946, column 20): " + [v.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($copy_v);
          }
          ;
          return $tco_result;
        };
        return go2;
      };
    };
  };
  var singleton6 = function(k) {
    return function(v) {
      return new Node(1, 1, k, v, Leaf.value, Leaf.value);
    };
  };
  var unsafeBalancedNode = /* @__PURE__ */ function() {
    var height8 = function(v) {
      if (v instanceof Leaf) {
        return 0;
      }
      ;
      if (v instanceof Node) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 757, column 12 - line 759, column 26): " + [v.constructor.name]);
    };
    var rotateLeft = function(k, v, l, rk, rv, rl, rr) {
      if (rl instanceof Node && rl.value0 > height8(rr)) {
        return unsafeNode(rl.value2, rl.value3, unsafeNode(k, v, l, rl.value4), unsafeNode(rk, rv, rl.value5, rr));
      }
      ;
      return unsafeNode(rk, rv, unsafeNode(k, v, l, rl), rr);
    };
    var rotateRight = function(k, v, lk, lv, ll, lr, r) {
      if (lr instanceof Node && height8(ll) <= lr.value0) {
        return unsafeNode(lr.value2, lr.value3, unsafeNode(lk, lv, ll, lr.value4), unsafeNode(k, v, lr.value5, r));
      }
      ;
      return unsafeNode(lk, lv, ll, unsafeNode(k, v, lr, r));
    };
    return function(k, v, l, r) {
      if (l instanceof Leaf) {
        if (r instanceof Leaf) {
          return singleton6(k)(v);
        }
        ;
        if (r instanceof Node && r.value0 > 1) {
          return rotateLeft(k, v, l, r.value2, r.value3, r.value4, r.value5);
        }
        ;
        return unsafeNode(k, v, l, r);
      }
      ;
      if (l instanceof Node) {
        if (r instanceof Node) {
          if (r.value0 > (l.value0 + 1 | 0)) {
            return rotateLeft(k, v, l, r.value2, r.value3, r.value4, r.value5);
          }
          ;
          if (l.value0 > (r.value0 + 1 | 0)) {
            return rotateRight(k, v, l.value2, l.value3, l.value4, l.value5, r);
          }
          ;
        }
        ;
        if (r instanceof Leaf && l.value0 > 1) {
          return rotateRight(k, v, l.value2, l.value3, l.value4, l.value5, r);
        }
        ;
        return unsafeNode(k, v, l, r);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 717, column 40 - line 738, column 34): " + [l.constructor.name]);
    };
  }();
  var $lazy_unsafeSplit = /* @__PURE__ */ $runtime_lazy5("unsafeSplit", "Data.Map.Internal", function() {
    return function(comp, k, m) {
      if (m instanceof Leaf) {
        return new Split(Nothing.value, Leaf.value, Leaf.value);
      }
      ;
      if (m instanceof Node) {
        var v = comp(k)(m.value2);
        if (v instanceof LT) {
          var v1 = $lazy_unsafeSplit(793)(comp, k, m.value4);
          return new Split(v1.value0, v1.value1, unsafeBalancedNode(m.value2, m.value3, v1.value2, m.value5));
        }
        ;
        if (v instanceof GT) {
          var v1 = $lazy_unsafeSplit(796)(comp, k, m.value5);
          return new Split(v1.value0, unsafeBalancedNode(m.value2, m.value3, m.value4, v1.value1), v1.value2);
        }
        ;
        if (v instanceof EQ) {
          return new Split(new Just(m.value3), m.value4, m.value5);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 791, column 5 - line 799, column 30): " + [v.constructor.name]);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 787, column 34 - line 799, column 30): " + [m.constructor.name]);
    };
  });
  var unsafeSplit = /* @__PURE__ */ $lazy_unsafeSplit(786);
  var $lazy_unsafeSplitLast = /* @__PURE__ */ $runtime_lazy5("unsafeSplitLast", "Data.Map.Internal", function() {
    return function(k, v, l, r) {
      if (r instanceof Leaf) {
        return new SplitLast(k, v, l);
      }
      ;
      if (r instanceof Node) {
        var v1 = $lazy_unsafeSplitLast(779)(r.value2, r.value3, r.value4, r.value5);
        return new SplitLast(v1.value0, v1.value1, unsafeBalancedNode(k, v, l, v1.value2));
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 776, column 37 - line 780, column 57): " + [r.constructor.name]);
    };
  });
  var unsafeSplitLast = /* @__PURE__ */ $lazy_unsafeSplitLast(775);
  var unsafeJoinNodes = function(v, v1) {
    if (v instanceof Leaf) {
      return v1;
    }
    ;
    if (v instanceof Node) {
      var v2 = unsafeSplitLast(v.value2, v.value3, v.value4, v.value5);
      return unsafeBalancedNode(v2.value0, v2.value1, v2.value2, v1);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 764, column 25 - line 768, column 38): " + [v.constructor.name, v1.constructor.name]);
  };
  var $lazy_unsafeUnionWith = /* @__PURE__ */ $runtime_lazy5("unsafeUnionWith", "Data.Map.Internal", function() {
    return function(comp, app, l, r) {
      if (l instanceof Leaf) {
        return r;
      }
      ;
      if (r instanceof Leaf) {
        return l;
      }
      ;
      if (r instanceof Node) {
        var v = unsafeSplit(comp, r.value2, l);
        var l$prime = $lazy_unsafeUnionWith(809)(comp, app, v.value1, r.value4);
        var r$prime = $lazy_unsafeUnionWith(810)(comp, app, v.value2, r.value5);
        if (v.value0 instanceof Just) {
          return unsafeBalancedNode(r.value2, app(v.value0.value0)(r.value3), l$prime, r$prime);
        }
        ;
        if (v.value0 instanceof Nothing) {
          return unsafeBalancedNode(r.value2, r.value3, l$prime, r$prime);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 811, column 5 - line 815, column 46): " + [v.value0.constructor.name]);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 804, column 42 - line 815, column 46): " + [l.constructor.name, r.constructor.name]);
    };
  });
  var unsafeUnionWith = /* @__PURE__ */ $lazy_unsafeUnionWith(803);
  var unionWith = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return function(app) {
      return function(m1) {
        return function(m2) {
          return unsafeUnionWith(compare4, app, m1, m2);
        };
      };
    };
  };
  var union2 = function(dictOrd) {
    return unionWith(dictOrd)($$const);
  };
  var semigroupMap = function() {
    return function(dictOrd) {
      var unionWith1 = unionWith(dictOrd);
      return function(dictSemigroup) {
        return {
          append: unionWith1(append(dictSemigroup))
        };
      };
    };
  };
  var semigroupMap1 = /* @__PURE__ */ semigroupMap();
  var pop = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return function(k) {
      return function(m) {
        var v = unsafeSplit(compare4, k, m);
        return map9(function(a2) {
          return new Tuple(a2, unsafeJoinNodes(v.value1, v.value2));
        })(v.value0);
      };
    };
  };
  var lookup2 = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return function(k) {
      var go2 = function($copy_v) {
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v) {
          if (v instanceof Leaf) {
            $tco_done = true;
            return Nothing.value;
          }
          ;
          if (v instanceof Node) {
            var v1 = compare4(k)(v.value2);
            if (v1 instanceof LT) {
              $copy_v = v.value4;
              return;
            }
            ;
            if (v1 instanceof GT) {
              $copy_v = v.value5;
              return;
            }
            ;
            if (v1 instanceof EQ) {
              $tco_done = true;
              return new Just(v.value3);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 283, column 7 - line 286, column 22): " + [v1.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 280, column 8 - line 286, column 22): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($copy_v);
        }
        ;
        return $tco_result;
      };
      return go2;
    };
  };
  var iterMapL = /* @__PURE__ */ function() {
    var go2 = function($copy_iter) {
      return function($copy_v) {
        var $tco_var_iter = $copy_iter;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(iter, v) {
          if (v instanceof Leaf) {
            $tco_done = true;
            return iter;
          }
          ;
          if (v instanceof Node) {
            if (v.value5 instanceof Leaf) {
              $tco_var_iter = new IterEmit(v.value2, v.value3, iter);
              $copy_v = v.value4;
              return;
            }
            ;
            $tco_var_iter = new IterEmit(v.value2, v.value3, new IterNode(v.value5, iter));
            $copy_v = v.value4;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 951, column 13 - line 958, column 48): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_iter, $copy_v);
        }
        ;
        return $tco_result;
      };
    };
    return go2;
  }();
  var stepAscCps = /* @__PURE__ */ stepWith(iterMapL);
  var stepUnfoldr = /* @__PURE__ */ function() {
    var step3 = function(k, v, next) {
      return new Just(new Tuple(new Tuple(k, v), next));
    };
    return stepAscCps(step3)(function(v) {
      return Nothing.value;
    });
  }();
  var toUnfoldable2 = function(dictUnfoldable) {
    var $784 = unfoldr(dictUnfoldable)(stepUnfoldr);
    return function($785) {
      return $784(toMapIter($785));
    };
  };
  var toUnfoldable1 = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
  var showMap = function(dictShow) {
    var showTuple2 = showTuple(dictShow);
    return function(dictShow1) {
      var show14 = show(showArray(showTuple2(dictShow1)));
      return {
        show: function(as) {
          return "(fromFoldable " + (show14(toUnfoldable1(as)) + ")");
        }
      };
    };
  };
  var insertWith = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return function(app) {
      return function(k) {
        return function(v) {
          var go2 = function(v1) {
            if (v1 instanceof Leaf) {
              return singleton6(k)(v);
            }
            ;
            if (v1 instanceof Node) {
              var v2 = compare4(k)(v1.value2);
              if (v2 instanceof LT) {
                return unsafeBalancedNode(v1.value2, v1.value3, go2(v1.value4), v1.value5);
              }
              ;
              if (v2 instanceof GT) {
                return unsafeBalancedNode(v1.value2, v1.value3, v1.value4, go2(v1.value5));
              }
              ;
              if (v2 instanceof EQ) {
                return new Node(v1.value0, v1.value1, k, app(v1.value3)(v), v1.value4, v1.value5);
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 486, column 7 - line 489, column 44): " + [v2.constructor.name]);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 483, column 8 - line 489, column 44): " + [v1.constructor.name]);
          };
          return go2;
        };
      };
    };
  };
  var insert = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return function(k) {
      return function(v) {
        var go2 = function(v1) {
          if (v1 instanceof Leaf) {
            return singleton6(k)(v);
          }
          ;
          if (v1 instanceof Node) {
            var v2 = compare4(k)(v1.value2);
            if (v2 instanceof LT) {
              return unsafeBalancedNode(v1.value2, v1.value3, go2(v1.value4), v1.value5);
            }
            ;
            if (v2 instanceof GT) {
              return unsafeBalancedNode(v1.value2, v1.value3, v1.value4, go2(v1.value5));
            }
            ;
            if (v2 instanceof EQ) {
              return new Node(v1.value0, v1.value1, k, v, v1.value4, v1.value5);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 471, column 7 - line 474, column 35): " + [v2.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 468, column 8 - line 474, column 35): " + [v1.constructor.name]);
        };
        return go2;
      };
    };
  };
  var functorMap = {
    map: function(f) {
      var go2 = function(v) {
        if (v instanceof Leaf) {
          return Leaf.value;
        }
        ;
        if (v instanceof Node) {
          return new Node(v.value0, v.value1, v.value2, f(v.value3), go2(v.value4), go2(v.value5));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 147, column 10 - line 150, column 39): " + [v.constructor.name]);
      };
      return go2;
    }
  };
  var functorWithIndexMap = {
    mapWithIndex: function(f) {
      var go2 = function(v) {
        if (v instanceof Leaf) {
          return Leaf.value;
        }
        ;
        if (v instanceof Node) {
          return new Node(v.value0, v.value1, v.value2, f(v.value2)(v.value3), go2(v.value4), go2(v.value5));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 155, column 10 - line 158, column 41): " + [v.constructor.name]);
      };
      return go2;
    },
    Functor0: function() {
      return functorMap;
    }
  };
  var foldableMap = {
    foldr: function(f) {
      return function(z) {
        var $lazy_go = $runtime_lazy5("go", "Data.Map.Internal", function() {
          return function(m$prime, z$prime) {
            if (m$prime instanceof Leaf) {
              return z$prime;
            }
            ;
            if (m$prime instanceof Node) {
              return $lazy_go(172)(m$prime.value4, f(m$prime.value3)($lazy_go(172)(m$prime.value5, z$prime)));
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 169, column 26 - line 172, column 43): " + [m$prime.constructor.name]);
          };
        });
        var go2 = $lazy_go(169);
        return function(m) {
          return go2(m, z);
        };
      };
    },
    foldl: function(f) {
      return function(z) {
        var $lazy_go = $runtime_lazy5("go", "Data.Map.Internal", function() {
          return function(z$prime, m$prime) {
            if (m$prime instanceof Leaf) {
              return z$prime;
            }
            ;
            if (m$prime instanceof Node) {
              return $lazy_go(178)(f($lazy_go(178)(z$prime, m$prime.value4))(m$prime.value3), m$prime.value5);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 175, column 26 - line 178, column 43): " + [m$prime.constructor.name]);
          };
        });
        var go2 = $lazy_go(175);
        return function(m) {
          return go2(z, m);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty4 = mempty(dictMonoid);
      var append15 = append(dictMonoid.Semigroup0());
      return function(f) {
        var go2 = function(v) {
          if (v instanceof Leaf) {
            return mempty4;
          }
          ;
          if (v instanceof Node) {
            return append15(go2(v.value4))(append15(f(v.value3))(go2(v.value5)));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 181, column 10 - line 184, column 28): " + [v.constructor.name]);
        };
        return go2;
      };
    }
  };
  var values = /* @__PURE__ */ function() {
    return foldr(foldableMap)(Cons.create)(Nil.value);
  }();
  var empty3 = /* @__PURE__ */ function() {
    return Leaf.value;
  }();
  var fromFoldable3 = function(dictOrd) {
    var insert13 = insert(dictOrd);
    return function(dictFoldable) {
      return foldl(dictFoldable)(function(m) {
        return function(v) {
          return insert13(v.value0)(v.value1)(m);
        };
      })(empty3);
    };
  };
  var monoidSemigroupMap = function() {
    return function(dictOrd) {
      var semigroupMap2 = semigroupMap1(dictOrd);
      return function(dictSemigroup) {
        var semigroupMap3 = semigroupMap2(dictSemigroup);
        return {
          mempty: empty3,
          Semigroup0: function() {
            return semigroupMap3;
          }
        };
      };
    };
  };
  var $$delete = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return function(k) {
      var go2 = function(v) {
        if (v instanceof Leaf) {
          return Leaf.value;
        }
        ;
        if (v instanceof Node) {
          var v1 = compare4(k)(v.value2);
          if (v1 instanceof LT) {
            return unsafeBalancedNode(v.value2, v.value3, go2(v.value4), v.value5);
          }
          ;
          if (v1 instanceof GT) {
            return unsafeBalancedNode(v.value2, v.value3, v.value4, go2(v.value5));
          }
          ;
          if (v1 instanceof EQ) {
            return unsafeJoinNodes(v.value4, v.value5);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 7 - line 501, column 43): " + [v1.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 8 - line 501, column 43): " + [v.constructor.name]);
      };
      return go2;
    };
  };
  var alter = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return function(f) {
      return function(k) {
        return function(m) {
          var v = unsafeSplit(compare4, k, m);
          var v2 = f(v.value0);
          if (v2 instanceof Nothing) {
            return unsafeJoinNodes(v.value1, v.value2);
          }
          ;
          if (v2 instanceof Just) {
            return unsafeBalancedNode(k, v2.value0, v.value1, v.value2);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 514, column 3 - line 518, column 41): " + [v2.constructor.name]);
        };
      };
    };
  };
  var altMap = function(dictOrd) {
    return {
      alt: union2(dictOrd),
      Functor0: function() {
        return functorMap;
      }
    };
  };
  var plusMap = function(dictOrd) {
    var altMap1 = altMap(dictOrd);
    return {
      empty: empty3,
      Alt0: function() {
        return altMap1;
      }
    };
  };

  // output/Halogen.Data.OrdBox/index.js
  var OrdBox = /* @__PURE__ */ function() {
    function OrdBox2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    OrdBox2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new OrdBox2(value0, value1, value22);
        };
      };
    };
    return OrdBox2;
  }();
  var mkOrdBox = function(dictOrd) {
    return OrdBox.create(eq(dictOrd.Eq0()))(compare(dictOrd));
  };
  var eqOrdBox = {
    eq: function(v) {
      return function(v1) {
        return v.value0(v.value2)(v1.value2);
      };
    }
  };
  var ordOrdBox = {
    compare: function(v) {
      return function(v1) {
        return v.value1(v.value2)(v1.value2);
      };
    },
    Eq0: function() {
      return eqOrdBox;
    }
  };

  // output/Halogen.Data.Slot/index.js
  var ordTuple2 = /* @__PURE__ */ ordTuple(ordString)(ordOrdBox);
  var pop1 = /* @__PURE__ */ pop(ordTuple2);
  var lookup1 = /* @__PURE__ */ lookup2(ordTuple2);
  var insert1 = /* @__PURE__ */ insert(ordTuple2);
  var pop2 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key) {
            return function(v) {
              return pop1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key)))(v);
            };
          };
        };
      };
    };
  };
  var lookup3 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key) {
            return function(v) {
              return lookup1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key)))(v);
            };
          };
        };
      };
    };
  };
  var insert2 = function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(dictOrd) {
        var mkOrdBox2 = mkOrdBox(dictOrd);
        return function(sym) {
          return function(key) {
            return function(val) {
              return function(v) {
                return insert1(new Tuple(reflectSymbol2(sym), mkOrdBox2(key)))(val)(v);
              };
            };
          };
        };
      };
    };
  };
  var foreachSlot = function(dictApplicative) {
    var traverse_7 = traverse_(dictApplicative)(foldableMap);
    return function(v) {
      return function(k) {
        return traverse_7(function($54) {
          return k($54);
        })(v);
      };
    };
  };
  var empty4 = empty3;

  // output/Control.Applicative.Free/index.js
  var identity10 = /* @__PURE__ */ identity(categoryFn);
  var Pure = /* @__PURE__ */ function() {
    function Pure2(value0) {
      this.value0 = value0;
    }
    ;
    Pure2.create = function(value0) {
      return new Pure2(value0);
    };
    return Pure2;
  }();
  var Lift = /* @__PURE__ */ function() {
    function Lift3(value0) {
      this.value0 = value0;
    }
    ;
    Lift3.create = function(value0) {
      return new Lift3(value0);
    };
    return Lift3;
  }();
  var Ap = /* @__PURE__ */ function() {
    function Ap2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Ap2.create = function(value0) {
      return function(value1) {
        return new Ap2(value0, value1);
      };
    };
    return Ap2;
  }();
  var mkAp = function(fba) {
    return function(fb) {
      return new Ap(fba, fb);
    };
  };
  var liftFreeAp = /* @__PURE__ */ function() {
    return Lift.create;
  }();
  var goLeft = function(dictApplicative) {
    var pure21 = pure(dictApplicative);
    return function(fStack) {
      return function(valStack) {
        return function(nat2) {
          return function(func) {
            return function(count) {
              if (func instanceof Pure) {
                return new Tuple(new Cons({
                  func: pure21(func.value0),
                  count
                }, fStack), valStack);
              }
              ;
              if (func instanceof Lift) {
                return new Tuple(new Cons({
                  func: nat2(func.value0),
                  count
                }, fStack), valStack);
              }
              ;
              if (func instanceof Ap) {
                return goLeft(dictApplicative)(fStack)(cons(func.value1)(valStack))(nat2)(func.value0)(count + 1 | 0);
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 102, column 41 - line 105, column 81): " + [func.constructor.name]);
            };
          };
        };
      };
    };
  };
  var goApply = function(dictApplicative) {
    var apply2 = apply(dictApplicative.Apply0());
    return function(fStack) {
      return function(vals) {
        return function(gVal) {
          if (fStack instanceof Nil) {
            return new Left(gVal);
          }
          ;
          if (fStack instanceof Cons) {
            var gRes = apply2(fStack.value0.func)(gVal);
            var $31 = fStack.value0.count === 1;
            if ($31) {
              if (fStack.value1 instanceof Nil) {
                return new Left(gRes);
              }
              ;
              return goApply(dictApplicative)(fStack.value1)(vals)(gRes);
            }
            ;
            if (vals instanceof Nil) {
              return new Left(gRes);
            }
            ;
            if (vals instanceof Cons) {
              return new Right(new Tuple(new Cons({
                func: gRes,
                count: fStack.value0.count - 1 | 0
              }, fStack.value1), new NonEmpty(vals.value0, vals.value1)));
            }
            ;
            throw new Error("Failed pattern match at Control.Applicative.Free (line 83, column 11 - line 88, column 50): " + [vals.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at Control.Applicative.Free (line 72, column 3 - line 88, column 50): " + [fStack.constructor.name]);
        };
      };
    };
  };
  var functorFreeAp = {
    map: function(f) {
      return function(x) {
        return mkAp(new Pure(f))(x);
      };
    }
  };
  var foldFreeAp = function(dictApplicative) {
    var goApply1 = goApply(dictApplicative);
    var pure21 = pure(dictApplicative);
    var goLeft1 = goLeft(dictApplicative);
    return function(nat2) {
      return function(z) {
        var go2 = function($copy_v) {
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v) {
            if (v.value1.value0 instanceof Pure) {
              var v1 = goApply1(v.value0)(v.value1.value1)(pure21(v.value1.value0.value0));
              if (v1 instanceof Left) {
                $tco_done = true;
                return v1.value0;
              }
              ;
              if (v1 instanceof Right) {
                $copy_v = v1.value0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 54, column 17 - line 56, column 24): " + [v1.constructor.name]);
            }
            ;
            if (v.value1.value0 instanceof Lift) {
              var v1 = goApply1(v.value0)(v.value1.value1)(nat2(v.value1.value0.value0));
              if (v1 instanceof Left) {
                $tco_done = true;
                return v1.value0;
              }
              ;
              if (v1 instanceof Right) {
                $copy_v = v1.value0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Control.Applicative.Free (line 57, column 17 - line 59, column 24): " + [v1.constructor.name]);
            }
            ;
            if (v.value1.value0 instanceof Ap) {
              var nextVals = new NonEmpty(v.value1.value0.value1, v.value1.value1);
              $copy_v = goLeft1(v.value0)(nextVals)(nat2)(v.value1.value0.value0)(1);
              return;
            }
            ;
            throw new Error("Failed pattern match at Control.Applicative.Free (line 53, column 5 - line 62, column 47): " + [v.value1.value0.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($copy_v);
          }
          ;
          return $tco_result;
        };
        return go2(new Tuple(Nil.value, singleton4(z)));
      };
    };
  };
  var retractFreeAp = function(dictApplicative) {
    return foldFreeAp(dictApplicative)(identity10);
  };
  var applyFreeAp = {
    apply: function(fba) {
      return function(fb) {
        return mkAp(fba)(fb);
      };
    },
    Functor0: function() {
      return functorFreeAp;
    }
  };
  var applicativeFreeAp = /* @__PURE__ */ function() {
    return {
      pure: Pure.create,
      Apply0: function() {
        return applyFreeAp;
      }
    };
  }();
  var foldFreeAp1 = /* @__PURE__ */ foldFreeAp(applicativeFreeAp);
  var hoistFreeAp = function(f) {
    return foldFreeAp1(function($54) {
      return liftFreeAp(f($54));
    });
  };

  // output/Data.CatQueue/index.js
  var CatQueue = /* @__PURE__ */ function() {
    function CatQueue2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CatQueue2.create = function(value0) {
      return function(value1) {
        return new CatQueue2(value0, value1);
      };
    };
    return CatQueue2;
  }();
  var uncons2 = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v) {
      if (v.value0 instanceof Nil && v.value1 instanceof Nil) {
        $tco_done = true;
        return Nothing.value;
      }
      ;
      if (v.value0 instanceof Nil) {
        $copy_v = new CatQueue(reverse2(v.value1), Nil.value);
        return;
      }
      ;
      if (v.value0 instanceof Cons) {
        $tco_done = true;
        return new Just(new Tuple(v.value0.value0, new CatQueue(v.value0.value1, v.value1)));
      }
      ;
      throw new Error("Failed pattern match at Data.CatQueue (line 82, column 1 - line 82, column 63): " + [v.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var snoc3 = function(v) {
    return function(a2) {
      return new CatQueue(v.value0, new Cons(a2, v.value1));
    };
  };
  var $$null2 = function(v) {
    if (v.value0 instanceof Nil && v.value1 instanceof Nil) {
      return true;
    }
    ;
    return false;
  };
  var empty5 = /* @__PURE__ */ function() {
    return new CatQueue(Nil.value, Nil.value);
  }();

  // output/Data.CatList/index.js
  var CatNil = /* @__PURE__ */ function() {
    function CatNil2() {
    }
    ;
    CatNil2.value = new CatNil2();
    return CatNil2;
  }();
  var CatCons = /* @__PURE__ */ function() {
    function CatCons2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    CatCons2.create = function(value0) {
      return function(value1) {
        return new CatCons2(value0, value1);
      };
    };
    return CatCons2;
  }();
  var link = function(v) {
    return function(v1) {
      if (v instanceof CatNil) {
        return v1;
      }
      ;
      if (v1 instanceof CatNil) {
        return v;
      }
      ;
      if (v instanceof CatCons) {
        return new CatCons(v.value0, snoc3(v.value1)(v1));
      }
      ;
      throw new Error("Failed pattern match at Data.CatList (line 108, column 1 - line 108, column 54): " + [v.constructor.name, v1.constructor.name]);
    };
  };
  var foldr5 = function(k) {
    return function(b2) {
      return function(q2) {
        var foldl7 = function($copy_v) {
          return function($copy_v1) {
            return function($copy_v2) {
              var $tco_var_v = $copy_v;
              var $tco_var_v1 = $copy_v1;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(v, v1, v2) {
                if (v2 instanceof Nil) {
                  $tco_done = true;
                  return v1;
                }
                ;
                if (v2 instanceof Cons) {
                  $tco_var_v = v;
                  $tco_var_v1 = v(v1)(v2.value0);
                  $copy_v2 = v2.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.CatList (line 124, column 3 - line 124, column 59): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
              }
              ;
              return $tco_result;
            };
          };
        };
        var go2 = function($copy_xs) {
          return function($copy_ys) {
            var $tco_var_xs = $copy_xs;
            var $tco_done1 = false;
            var $tco_result;
            function $tco_loop(xs, ys) {
              var v = uncons2(xs);
              if (v instanceof Nothing) {
                $tco_done1 = true;
                return foldl7(function(x) {
                  return function(i2) {
                    return i2(x);
                  };
                })(b2)(ys);
              }
              ;
              if (v instanceof Just) {
                $tco_var_xs = v.value0.value1;
                $copy_ys = new Cons(k(v.value0.value0), ys);
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.CatList (line 120, column 14 - line 122, column 67): " + [v.constructor.name]);
            }
            ;
            while (!$tco_done1) {
              $tco_result = $tco_loop($tco_var_xs, $copy_ys);
            }
            ;
            return $tco_result;
          };
        };
        return go2(q2)(Nil.value);
      };
    };
  };
  var uncons3 = function(v) {
    if (v instanceof CatNil) {
      return Nothing.value;
    }
    ;
    if (v instanceof CatCons) {
      return new Just(new Tuple(v.value0, function() {
        var $66 = $$null2(v.value1);
        if ($66) {
          return CatNil.value;
        }
        ;
        return foldr5(link)(CatNil.value)(v.value1);
      }()));
    }
    ;
    throw new Error("Failed pattern match at Data.CatList (line 99, column 1 - line 99, column 61): " + [v.constructor.name]);
  };
  var empty6 = /* @__PURE__ */ function() {
    return CatNil.value;
  }();
  var append2 = link;
  var semigroupCatList = {
    append: append2
  };
  var snoc4 = function(cat) {
    return function(a2) {
      return append2(cat)(new CatCons(a2, empty5));
    };
  };

  // output/Control.Monad.Free/index.js
  var $runtime_lazy6 = function(name16, moduleName, init2) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init2();
      state3 = 2;
      return val;
    };
  };
  var append3 = /* @__PURE__ */ append(semigroupCatList);
  var Free = /* @__PURE__ */ function() {
    function Free2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Free2.create = function(value0) {
      return function(value1) {
        return new Free2(value0, value1);
      };
    };
    return Free2;
  }();
  var Return = /* @__PURE__ */ function() {
    function Return2(value0) {
      this.value0 = value0;
    }
    ;
    Return2.create = function(value0) {
      return new Return2(value0);
    };
    return Return2;
  }();
  var Bind = /* @__PURE__ */ function() {
    function Bind2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Bind2.create = function(value0) {
      return function(value1) {
        return new Bind2(value0, value1);
      };
    };
    return Bind2;
  }();
  var toView = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v) {
      var runExpF = function(v22) {
        return v22;
      };
      var concatF = function(v22) {
        return function(r) {
          return new Free(v22.value0, append3(v22.value1)(r));
        };
      };
      if (v.value0 instanceof Return) {
        var v2 = uncons3(v.value1);
        if (v2 instanceof Nothing) {
          $tco_done = true;
          return new Return(v.value0.value0);
        }
        ;
        if (v2 instanceof Just) {
          $copy_v = concatF(runExpF(v2.value0.value0)(v.value0.value0))(v2.value0.value1);
          return;
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 227, column 7 - line 231, column 64): " + [v2.constructor.name]);
      }
      ;
      if (v.value0 instanceof Bind) {
        $tco_done = true;
        return new Bind(v.value0.value0, function(a2) {
          return concatF(v.value0.value1(a2))(v.value1);
        });
      }
      ;
      throw new Error("Failed pattern match at Control.Monad.Free (line 225, column 3 - line 233, column 56): " + [v.value0.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var fromView = function(f) {
    return new Free(f, empty6);
  };
  var freeMonad = {
    Applicative0: function() {
      return freeApplicative;
    },
    Bind1: function() {
      return freeBind;
    }
  };
  var freeFunctor = {
    map: function(k) {
      return function(f) {
        return bindFlipped(freeBind)(function() {
          var $189 = pure(freeApplicative);
          return function($190) {
            return $189(k($190));
          };
        }())(f);
      };
    }
  };
  var freeBind = {
    bind: function(v) {
      return function(k) {
        return new Free(v.value0, snoc4(v.value1)(k));
      };
    },
    Apply0: function() {
      return $lazy_freeApply(0);
    }
  };
  var freeApplicative = {
    pure: function($191) {
      return fromView(Return.create($191));
    },
    Apply0: function() {
      return $lazy_freeApply(0);
    }
  };
  var $lazy_freeApply = /* @__PURE__ */ $runtime_lazy6("freeApply", "Control.Monad.Free", function() {
    return {
      apply: ap(freeMonad),
      Functor0: function() {
        return freeFunctor;
      }
    };
  });
  var pure3 = /* @__PURE__ */ pure(freeApplicative);
  var liftF = function(f) {
    return fromView(new Bind(f, function($192) {
      return pure3($192);
    }));
  };
  var foldFree = function(dictMonadRec) {
    var Monad0 = dictMonadRec.Monad0();
    var map112 = map(Monad0.Bind1().Apply0().Functor0());
    var pure110 = pure(Monad0.Applicative0());
    var tailRecM4 = tailRecM(dictMonadRec);
    return function(k) {
      var go2 = function(f) {
        var v = toView(f);
        if (v instanceof Return) {
          return map112(Done.create)(pure110(v.value0));
        }
        ;
        if (v instanceof Bind) {
          return map112(function($199) {
            return Loop.create(v.value1($199));
          })(k(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Control.Monad.Free (line 158, column 10 - line 160, column 37): " + [v.constructor.name]);
      };
      return tailRecM4(go2);
    };
  };

  // output/Control.Monad.State.Trans/index.js
  var runStateT = function(v) {
    return v;
  };
  var monadTransStateT = {
    lift: function(dictMonad) {
      var bind9 = bind(dictMonad.Bind1());
      var pure21 = pure(dictMonad.Applicative0());
      return function(m) {
        return function(s) {
          return bind9(m)(function(x) {
            return pure21(new Tuple(x, s));
          });
        };
      };
    }
  };
  var lift5 = /* @__PURE__ */ lift(monadTransStateT);
  var functorStateT = function(dictFunctor) {
    var map29 = map(dictFunctor);
    return {
      map: function(f) {
        return function(v) {
          return function(s) {
            return map29(function(v1) {
              return new Tuple(f(v1.value0), v1.value1);
            })(v(s));
          };
        };
      }
    };
  };
  var monadStateT = function(dictMonad) {
    return {
      Applicative0: function() {
        return applicativeStateT(dictMonad);
      },
      Bind1: function() {
        return bindStateT(dictMonad);
      }
    };
  };
  var bindStateT = function(dictMonad) {
    var bind9 = bind(dictMonad.Bind1());
    return {
      bind: function(v) {
        return function(f) {
          return function(s) {
            return bind9(v(s))(function(v1) {
              var v3 = f(v1.value0);
              return v3(v1.value1);
            });
          };
        };
      },
      Apply0: function() {
        return applyStateT(dictMonad);
      }
    };
  };
  var applyStateT = function(dictMonad) {
    var functorStateT1 = functorStateT(dictMonad.Bind1().Apply0().Functor0());
    return {
      apply: ap(monadStateT(dictMonad)),
      Functor0: function() {
        return functorStateT1;
      }
    };
  };
  var applicativeStateT = function(dictMonad) {
    var pure21 = pure(dictMonad.Applicative0());
    return {
      pure: function(a2) {
        return function(s) {
          return pure21(new Tuple(a2, s));
        };
      },
      Apply0: function() {
        return applyStateT(dictMonad);
      }
    };
  };
  var monadStateStateT = function(dictMonad) {
    var pure21 = pure(dictMonad.Applicative0());
    var monadStateT1 = monadStateT(dictMonad);
    return {
      state: function(f) {
        return function($200) {
          return pure21(f($200));
        };
      },
      Monad0: function() {
        return monadStateT1;
      }
    };
  };
  var monadTellStateT = function(dictMonadTell) {
    var Monad1 = dictMonadTell.Monad1();
    var Semigroup0 = dictMonadTell.Semigroup0();
    var monadStateT1 = monadStateT(Monad1);
    return {
      tell: function() {
        var $201 = lift5(Monad1);
        var $202 = tell(dictMonadTell);
        return function($203) {
          return $201($202($203));
        };
      }(),
      Semigroup0: function() {
        return Semigroup0;
      },
      Monad1: function() {
        return monadStateT1;
      }
    };
  };
  var monadWriterStateT = function(dictMonadWriter) {
    var MonadTell1 = dictMonadWriter.MonadTell1();
    var Monad1 = MonadTell1.Monad1();
    var bind9 = bind(Monad1.Bind1());
    var listen2 = listen(dictMonadWriter);
    var pure21 = pure(Monad1.Applicative0());
    var pass2 = pass(dictMonadWriter);
    var Monoid0 = dictMonadWriter.Monoid0();
    var monadTellStateT1 = monadTellStateT(MonadTell1);
    return {
      listen: function(m) {
        return function(s) {
          return bind9(listen2(m(s)))(function(v) {
            return pure21(new Tuple(new Tuple(v.value0.value0, v.value1), v.value0.value1));
          });
        };
      },
      pass: function(m) {
        return function(s) {
          return pass2(bind9(m(s))(function(v) {
            return pure21(new Tuple(new Tuple(v.value0.value0, v.value1), v.value0.value1));
          }));
        };
      },
      Monoid0: function() {
        return Monoid0;
      },
      MonadTell1: function() {
        return monadTellStateT1;
      }
    };
  };

  // output/Halogen.Query.ChildQuery/index.js
  var ChildQuery = /* @__PURE__ */ function() {
    function ChildQuery3(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    ChildQuery3.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new ChildQuery3(value0, value1, value22);
        };
      };
    };
    return ChildQuery3;
  }();
  var unChildQueryBox = unsafeCoerce2;
  var mkChildQueryBox = unsafeCoerce2;

  // output/Unsafe.Reference/foreign.js
  function reallyUnsafeRefEq(a2) {
    return function(b2) {
      return a2 === b2;
    };
  }

  // output/Unsafe.Reference/index.js
  var unsafeRefEq = reallyUnsafeRefEq;

  // output/Halogen.Subscription/index.js
  var $$void4 = /* @__PURE__ */ $$void(functorEffect);
  var bind2 = /* @__PURE__ */ bind(bindEffect);
  var append4 = /* @__PURE__ */ append(semigroupArray);
  var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_1 = /* @__PURE__ */ traverse_2(foldableArray);
  var unsubscribe = function(v) {
    return v;
  };
  var subscribe = function(v) {
    return function(k) {
      return v(function($76) {
        return $$void4(k($76));
      });
    };
  };
  var notify = function(v) {
    return function(a2) {
      return v(a2);
    };
  };
  var create = function __do() {
    var subscribers = $$new([])();
    return {
      emitter: function(k) {
        return function __do2() {
          modify_(function(v) {
            return append4(v)([k]);
          })(subscribers)();
          return modify_(deleteBy(unsafeRefEq)(k))(subscribers);
        };
      },
      listener: function(a2) {
        return bind2(read(subscribers))(traverse_1(function(k) {
          return k(a2);
        }));
      }
    };
  };

  // output/Halogen.Query.HalogenM/index.js
  var identity11 = /* @__PURE__ */ identity(categoryFn);
  var lookup4 = /* @__PURE__ */ lookup3();
  var SubscriptionId = function(x) {
    return x;
  };
  var ForkId = function(x) {
    return x;
  };
  var State = /* @__PURE__ */ function() {
    function State2(value0) {
      this.value0 = value0;
    }
    ;
    State2.create = function(value0) {
      return new State2(value0);
    };
    return State2;
  }();
  var Subscribe = /* @__PURE__ */ function() {
    function Subscribe2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Subscribe2.create = function(value0) {
      return function(value1) {
        return new Subscribe2(value0, value1);
      };
    };
    return Subscribe2;
  }();
  var Unsubscribe = /* @__PURE__ */ function() {
    function Unsubscribe2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Unsubscribe2.create = function(value0) {
      return function(value1) {
        return new Unsubscribe2(value0, value1);
      };
    };
    return Unsubscribe2;
  }();
  var Lift2 = /* @__PURE__ */ function() {
    function Lift3(value0) {
      this.value0 = value0;
    }
    ;
    Lift3.create = function(value0) {
      return new Lift3(value0);
    };
    return Lift3;
  }();
  var ChildQuery2 = /* @__PURE__ */ function() {
    function ChildQuery3(value0) {
      this.value0 = value0;
    }
    ;
    ChildQuery3.create = function(value0) {
      return new ChildQuery3(value0);
    };
    return ChildQuery3;
  }();
  var Raise = /* @__PURE__ */ function() {
    function Raise2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Raise2.create = function(value0) {
      return function(value1) {
        return new Raise2(value0, value1);
      };
    };
    return Raise2;
  }();
  var Par = /* @__PURE__ */ function() {
    function Par2(value0) {
      this.value0 = value0;
    }
    ;
    Par2.create = function(value0) {
      return new Par2(value0);
    };
    return Par2;
  }();
  var Fork = /* @__PURE__ */ function() {
    function Fork2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Fork2.create = function(value0) {
      return function(value1) {
        return new Fork2(value0, value1);
      };
    };
    return Fork2;
  }();
  var Join = /* @__PURE__ */ function() {
    function Join2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Join2.create = function(value0) {
      return function(value1) {
        return new Join2(value0, value1);
      };
    };
    return Join2;
  }();
  var Kill = /* @__PURE__ */ function() {
    function Kill2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Kill2.create = function(value0) {
      return function(value1) {
        return new Kill2(value0, value1);
      };
    };
    return Kill2;
  }();
  var GetRef = /* @__PURE__ */ function() {
    function GetRef2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    GetRef2.create = function(value0) {
      return function(value1) {
        return new GetRef2(value0, value1);
      };
    };
    return GetRef2;
  }();
  var HalogenM = function(x) {
    return x;
  };
  var raise = function(o) {
    return liftF(new Raise(o, unit));
  };
  var query = function() {
    return function(dictIsSymbol) {
      var lookup15 = lookup4(dictIsSymbol);
      return function(dictOrd) {
        var lookup24 = lookup15(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(q2) {
              return liftF(new ChildQuery2(mkChildQueryBox(new ChildQuery(function(dictApplicative) {
                var pure110 = pure(dictApplicative);
                return function(k) {
                  var $177 = maybe(pure110(Nothing.value))(k);
                  var $178 = lookup24(label5)(p2);
                  return function($179) {
                    return $177($178($179));
                  };
                };
              }, q2, identity11))));
            };
          };
        };
      };
    };
  };
  var ordSubscriptionId = ordInt;
  var ordForkId = ordInt;
  var monadHalogenM = freeMonad;
  var monadStateHalogenM = {
    state: function($181) {
      return HalogenM(liftF(State.create($181)));
    },
    Monad0: function() {
      return monadHalogenM;
    }
  };
  var monadEffectHalogenM = function(dictMonadEffect) {
    return {
      liftEffect: function() {
        var $186 = liftEffect(dictMonadEffect);
        return function($187) {
          return HalogenM(liftF(Lift2.create($186($187))));
        };
      }(),
      Monad0: function() {
        return monadHalogenM;
      }
    };
  };
  var functorHalogenM = freeFunctor;
  var bindHalogenM = freeBind;
  var applicativeHalogenM = freeApplicative;

  // output/Halogen.Query.HalogenQ/index.js
  var Initialize = /* @__PURE__ */ function() {
    function Initialize2(value0) {
      this.value0 = value0;
    }
    ;
    Initialize2.create = function(value0) {
      return new Initialize2(value0);
    };
    return Initialize2;
  }();
  var Finalize = /* @__PURE__ */ function() {
    function Finalize2(value0) {
      this.value0 = value0;
    }
    ;
    Finalize2.create = function(value0) {
      return new Finalize2(value0);
    };
    return Finalize2;
  }();
  var Receive = /* @__PURE__ */ function() {
    function Receive2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Receive2.create = function(value0) {
      return function(value1) {
        return new Receive2(value0, value1);
      };
    };
    return Receive2;
  }();
  var Action2 = /* @__PURE__ */ function() {
    function Action3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Action3.create = function(value0) {
      return function(value1) {
        return new Action3(value0, value1);
      };
    };
    return Action3;
  }();
  var Query = /* @__PURE__ */ function() {
    function Query2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Query2.create = function(value0) {
      return function(value1) {
        return new Query2(value0, value1);
      };
    };
    return Query2;
  }();

  // output/Halogen.VDom.Thunk/index.js
  var $runtime_lazy7 = function(name16, moduleName, init2) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init2();
      state3 = 2;
      return val;
    };
  };
  var unsafeEqThunk = function(v, v1) {
    return refEq2(v.value0, v1.value0) && (refEq2(v.value1, v1.value1) && v.value1(v.value3, v1.value3));
  };
  var runThunk = function(v) {
    return v.value2(v.value3);
  };
  var buildThunk = function(toVDom) {
    var haltThunk = function(state3) {
      return halt(state3.vdom);
    };
    var $lazy_patchThunk = $runtime_lazy7("patchThunk", "Halogen.VDom.Thunk", function() {
      return function(state3, t2) {
        var $48 = unsafeEqThunk(state3.thunk, t2);
        if ($48) {
          return mkStep(new Step(extract2(state3.vdom), state3, $lazy_patchThunk(112), haltThunk));
        }
        ;
        var vdom = step(state3.vdom, toVDom(runThunk(t2)));
        return mkStep(new Step(extract2(vdom), {
          vdom,
          thunk: t2
        }, $lazy_patchThunk(115), haltThunk));
      };
    });
    var patchThunk = $lazy_patchThunk(108);
    var renderThunk = function(spec) {
      return function(t) {
        var vdom = buildVDom(spec)(toVDom(runThunk(t)));
        return mkStep(new Step(extract2(vdom), {
          thunk: t,
          vdom
        }, patchThunk, haltThunk));
      };
    };
    return renderThunk;
  };

  // output/Halogen.Component/index.js
  var voidLeft2 = /* @__PURE__ */ voidLeft(functorHalogenM);
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeHalogenM)(foldableMaybe);
  var map10 = /* @__PURE__ */ map(functorHalogenM);
  var pure4 = /* @__PURE__ */ pure(applicativeHalogenM);
  var lookup5 = /* @__PURE__ */ lookup3();
  var pop3 = /* @__PURE__ */ pop2();
  var insert3 = /* @__PURE__ */ insert2();
  var ComponentSlot = /* @__PURE__ */ function() {
    function ComponentSlot2(value0) {
      this.value0 = value0;
    }
    ;
    ComponentSlot2.create = function(value0) {
      return new ComponentSlot2(value0);
    };
    return ComponentSlot2;
  }();
  var ThunkSlot = /* @__PURE__ */ function() {
    function ThunkSlot2(value0) {
      this.value0 = value0;
    }
    ;
    ThunkSlot2.create = function(value0) {
      return new ThunkSlot2(value0);
    };
    return ThunkSlot2;
  }();
  var unComponentSlot = unsafeCoerce2;
  var unComponent = unsafeCoerce2;
  var mkEval = function(args) {
    return function(v) {
      if (v instanceof Initialize) {
        return voidLeft2(traverse_3(args.handleAction)(args.initialize))(v.value0);
      }
      ;
      if (v instanceof Finalize) {
        return voidLeft2(traverse_3(args.handleAction)(args.finalize))(v.value0);
      }
      ;
      if (v instanceof Receive) {
        return voidLeft2(traverse_3(args.handleAction)(args.receive(v.value0)))(v.value1);
      }
      ;
      if (v instanceof Action2) {
        return voidLeft2(args.handleAction(v.value0))(v.value1);
      }
      ;
      if (v instanceof Query) {
        return unCoyoneda(function(g) {
          var $45 = map10(maybe(v.value1(unit))(g));
          return function($46) {
            return $45(args.handleQuery($46));
          };
        })(v.value0);
      }
      ;
      throw new Error("Failed pattern match at Halogen.Component (line 182, column 15 - line 192, column 71): " + [v.constructor.name]);
    };
  };
  var mkComponentSlot = unsafeCoerce2;
  var mkComponent = unsafeCoerce2;
  var defaultEval = /* @__PURE__ */ function() {
    return {
      handleAction: $$const(pure4(unit)),
      handleQuery: $$const(pure4(Nothing.value)),
      receive: $$const(Nothing.value),
      initialize: Nothing.value,
      finalize: Nothing.value
    };
  }();
  var componentSlot = function() {
    return function(dictIsSymbol) {
      var lookup15 = lookup5(dictIsSymbol);
      var pop12 = pop3(dictIsSymbol);
      var insert13 = insert3(dictIsSymbol);
      return function(dictOrd) {
        var lookup24 = lookup15(dictOrd);
        var pop22 = pop12(dictOrd);
        var insert22 = insert13(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(comp) {
              return function(input3) {
                return function(output2) {
                  return mkComponentSlot({
                    get: lookup24(label5)(p2),
                    pop: pop22(label5)(p2),
                    set: insert22(label5)(p2),
                    component: comp,
                    input: input3,
                    output: output2
                  });
                };
              };
            };
          };
        };
      };
    };
  };

  // output/Halogen.HTML.Elements/index.js
  var element2 = /* @__PURE__ */ function() {
    return element(Nothing.value);
  }();
  var span2 = /* @__PURE__ */ element2("span");
  var span_ = /* @__PURE__ */ span2([]);
  var sub2 = /* @__PURE__ */ element2("sub");
  var sub_ = /* @__PURE__ */ sub2([]);
  var sup = /* @__PURE__ */ element2("sup");
  var div2 = /* @__PURE__ */ element2("div");
  var button2 = /* @__PURE__ */ element2("button");

  // output/Halogen.HTML/index.js
  var componentSlot2 = /* @__PURE__ */ componentSlot();
  var slot = function() {
    return function(dictIsSymbol) {
      var componentSlot1 = componentSlot2(dictIsSymbol);
      return function(dictOrd) {
        var componentSlot22 = componentSlot1(dictOrd);
        return function(label5) {
          return function(p2) {
            return function(component5) {
              return function(input3) {
                return function(outputQuery) {
                  return widget(new ComponentSlot(componentSlot22(label5)(p2)(component5)(input3)(function($11) {
                    return Just.create(outputQuery($11));
                  })));
                };
              };
            };
          };
        };
      };
    };
  };
  var fromPlainHTML = unsafeCoerce2;

  // output/Control.Monad.Except/index.js
  var unwrap2 = /* @__PURE__ */ unwrap();
  var runExcept = function($3) {
    return unwrap2(runExceptT($3));
  };

  // output/Web.HTML.Event.EventTypes/index.js
  var domcontentloaded = "DOMContentLoaded";

  // output/Web.UIEvent.MouseEvent.EventTypes/index.js
  var mouseleave = "mouseleave";
  var mouseenter = "mouseenter";
  var click = "click";

  // output/Halogen.HTML.Events/index.js
  var mouseHandler = unsafeCoerce2;
  var handler2 = function(et) {
    return function(f) {
      return handler(et)(function(ev) {
        return new Just(new Action(f(ev)));
      });
    };
  };
  var onClick = /* @__PURE__ */ function() {
    var $15 = handler2(click);
    return function($16) {
      return $15(mouseHandler($16));
    };
  }();
  var onMouseEnter = /* @__PURE__ */ function() {
    var $29 = handler2(mouseenter);
    return function($30) {
      return $29(mouseHandler($30));
    };
  }();
  var onMouseLeave = /* @__PURE__ */ function() {
    var $31 = handler2(mouseleave);
    return function($32) {
      return $31(mouseHandler($32));
    };
  }();

  // output/Foliage.App.Console.Component/index.js
  var append5 = /* @__PURE__ */ append(semigroupArray);
  var map13 = /* @__PURE__ */ map(functorArray);
  var pure5 = /* @__PURE__ */ pure(applicativeArray);
  var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorArray);
  var discard3 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var modify_3 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var pure1 = /* @__PURE__ */ pure(applicativeHalogenM);
  var AddLog = /* @__PURE__ */ function() {
    function AddLog2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    AddLog2.create = function(value0) {
      return function(value1) {
        return new AddLog2(value0, value1);
      };
    };
    return AddLog2;
  }();
  var SetLogs = /* @__PURE__ */ function() {
    function SetLogs2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    SetLogs2.create = function(value0) {
      return function(value1) {
        return new SetLogs2(value0, value1);
      };
    };
    return SetLogs2;
  }();
  var ShowIntermediateEnv = /* @__PURE__ */ function() {
    function ShowIntermediateEnv2(value0) {
      this.value0 = value0;
    }
    ;
    ShowIntermediateEnv2.create = function(value0) {
      return new ShowIntermediateEnv2(value0);
    };
    return ShowIntermediateEnv2;
  }();
  var HideIntermediateEnv = /* @__PURE__ */ function() {
    function HideIntermediateEnv2() {
    }
    ;
    HideIntermediateEnv2.value = new HideIntermediateEnv2();
    return HideIntermediateEnv2;
  }();
  var MouseEnterLogHeader = /* @__PURE__ */ function() {
    function MouseEnterLogHeader2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    MouseEnterLogHeader2.create = function(value0) {
      return function(value1) {
        return new MouseEnterLogHeader2(value0, value1);
      };
    };
    return MouseEnterLogHeader2;
  }();
  var MouseLeaveLogHeader = /* @__PURE__ */ function() {
    function MouseLeaveLogHeader2(value0) {
      this.value0 = value0;
    }
    ;
    MouseLeaveLogHeader2.create = function(value0) {
      return new MouseLeaveLogHeader2(value0);
    };
    return MouseLeaveLogHeader2;
  }();
  var component = /* @__PURE__ */ function() {
    var renderLog = function(v) {
      return div2([style2(append5(flex_column)([]))])([div2([style2(append5(bold)(["background-color: rgba(0, 0, 0, 0.2)"])), onMouseEnter(MouseEnterLogHeader.create(v.value1)), onMouseLeave(MouseLeaveLogHeader.create)])([text(v.value0.label)]), div2([style2(append5(flex_column)(["padding-left: 1.0em", "gap: 1em"]))])(map13(function(v1) {
        return fromPlainHTML(div2([style2(flex_row)])([div2([style2(append5(underline)(["flex-shrink: 0", "padding-right: 0.2em", "width: 8em", "text-align: right", "border-right: 1px solid black"]))])(pure5(text(v1.value0))), v1.value1]));
      })(v.value0.messages))]);
    };
    var render14 = function(state3) {
      return div2([style2(append5(flex_column)(append5(font_code)(["gap: 1.0em"])))])([div2([style2(flex_row)])([button2([style2(button)])([text("Clear")])]), div2([style2(append5(padding_small)(append5(flex_column)(["gap: 2em", "overflow: scroll"])))])(mapFlipped2(state3.logs)(renderLog))]);
    };
    var initialState = function(input3) {
      return {
        logs: []
      };
    };
    var handleQuery = function(v) {
      if (v instanceof AddLog) {
        return discard3(modify_3(function(state3) {
          var $22 = {};
          for (var $23 in state3) {
            if ({}.hasOwnProperty.call(state3, $23)) {
              $22[$23] = state3[$23];
            }
            ;
          }
          ;
          $22.logs = snoc(state3.logs)(v.value0);
          return $22;
        }))(function() {
          return pure1(new Just(v.value1));
        });
      }
      ;
      if (v instanceof SetLogs) {
        return discard3(modify_3(function(v1) {
          var $27 = {};
          for (var $28 in v1) {
            if ({}.hasOwnProperty.call(v1, $28)) {
              $27[$28] = v1[$28];
            }
            ;
          }
          ;
          $27.logs = v.value0;
          return $27;
        }))(function() {
          return pure1(new Just(v.value1));
        });
      }
      ;
      throw new Error("Failed pattern match at Foliage.App.Console.Component (line 38, column 17 - line 44, column 20): " + [v.constructor.name]);
    };
    var handleAction = function(v) {
      if (v instanceof MouseEnterLogHeader) {
        return discard3(maybe(pure1(unit))(function(env) {
          return raise(new ShowIntermediateEnv(env));
        })(v.value0))(function() {
          return pure1(unit);
        });
      }
      ;
      if (v instanceof MouseLeaveLogHeader) {
        return discard3(raise(HideIntermediateEnv.value))(function() {
          return pure1(unit);
        });
      }
      ;
      throw new Error("Failed pattern match at Foliage.App.Console.Component (line 46, column 18 - line 52, column 16): " + [v.constructor.name]);
    };
    var $$eval = mkEval({
      receive: defaultEval.receive,
      initialize: defaultEval.initialize,
      finalize: defaultEval.finalize,
      handleQuery,
      handleAction
    });
    return mkComponent({
      initialState,
      "eval": $$eval,
      render: render14
    });
  }();

  // output/Control.Monad.Reader/index.js
  var unwrap3 = /* @__PURE__ */ unwrap();
  var runReader = function(v) {
    return function($4) {
      return unwrap3(v($4));
    };
  };

  // output/Control.Monad.State/index.js
  var evalState = function(v) {
    return function(s) {
      var v1 = v(s);
      return v1.value0;
    };
  };

  // output/Data.Eq.Generic/index.js
  var genericEqArgument = function(dictEq) {
    var eq4 = eq(dictEq);
    return {
      "genericEq'": function(v) {
        return function(v1) {
          return eq4(v)(v1);
        };
      }
    };
  };
  var genericEq$prime = function(dict) {
    return dict["genericEq'"];
  };
  var genericEqConstructor = function(dictGenericEq) {
    var genericEq$prime1 = genericEq$prime(dictGenericEq);
    return {
      "genericEq'": function(v) {
        return function(v1) {
          return genericEq$prime1(v)(v1);
        };
      }
    };
  };
  var genericEqProduct = function(dictGenericEq) {
    var genericEq$prime1 = genericEq$prime(dictGenericEq);
    return function(dictGenericEq1) {
      var genericEq$prime2 = genericEq$prime(dictGenericEq1);
      return {
        "genericEq'": function(v) {
          return function(v1) {
            return genericEq$prime1(v.value0)(v1.value0) && genericEq$prime2(v.value1)(v1.value1);
          };
        }
      };
    };
  };
  var genericEq = function(dictGeneric) {
    var from3 = from(dictGeneric);
    return function(dictGenericEq) {
      var genericEq$prime1 = genericEq$prime(dictGenericEq);
      return function(x) {
        return function(y) {
          return genericEq$prime1(from3(x))(from3(y));
        };
      };
    };
  };

  // output/Data.Ord.Generic/index.js
  var genericOrdArgument = function(dictOrd) {
    var compare4 = compare(dictOrd);
    return {
      "genericCompare'": function(v) {
        return function(v1) {
          return compare4(v)(v1);
        };
      }
    };
  };
  var genericCompare$prime = function(dict) {
    return dict["genericCompare'"];
  };
  var genericOrdConstructor = function(dictGenericOrd) {
    var genericCompare$prime1 = genericCompare$prime(dictGenericOrd);
    return {
      "genericCompare'": function(v) {
        return function(v1) {
          return genericCompare$prime1(v)(v1);
        };
      }
    };
  };
  var genericOrdProduct = function(dictGenericOrd) {
    var genericCompare$prime1 = genericCompare$prime(dictGenericOrd);
    return function(dictGenericOrd1) {
      var genericCompare$prime2 = genericCompare$prime(dictGenericOrd1);
      return {
        "genericCompare'": function(v) {
          return function(v1) {
            var v2 = genericCompare$prime1(v.value0)(v1.value0);
            if (v2 instanceof EQ) {
              return genericCompare$prime2(v.value1)(v1.value1);
            }
            ;
            return v2;
          };
        }
      };
    };
  };
  var genericCompare = function(dictGeneric) {
    var from3 = from(dictGeneric);
    return function(dictGenericOrd) {
      var genericCompare$prime1 = genericCompare$prime(dictGenericOrd);
      return function(x) {
        return function(y) {
          return genericCompare$prime1(from3(x))(from3(y));
        };
      };
    };
  };

  // output/Data.Show.Generic/foreign.js
  var intercalate4 = function(separator) {
    return function(xs) {
      return xs.join(separator);
    };
  };

  // output/Data.Show.Generic/index.js
  var append6 = /* @__PURE__ */ append(semigroupArray);
  var genericShowArgsNoArguments = {
    genericShowArgs: function(v) {
      return [];
    }
  };
  var genericShowArgsArgument = function(dictShow) {
    var show11 = show(dictShow);
    return {
      genericShowArgs: function(v) {
        return [show11(v)];
      }
    };
  };
  var genericShowArgs = function(dict) {
    return dict.genericShowArgs;
  };
  var genericShowArgsProduct = function(dictGenericShowArgs) {
    var genericShowArgs1 = genericShowArgs(dictGenericShowArgs);
    return function(dictGenericShowArgs1) {
      var genericShowArgs2 = genericShowArgs(dictGenericShowArgs1);
      return {
        genericShowArgs: function(v) {
          return append6(genericShowArgs1(v.value0))(genericShowArgs2(v.value1));
        }
      };
    };
  };
  var genericShowConstructor = function(dictGenericShowArgs) {
    var genericShowArgs1 = genericShowArgs(dictGenericShowArgs);
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return {
        "genericShow'": function(v) {
          var ctor = reflectSymbol2($$Proxy.value);
          var v1 = genericShowArgs1(v);
          if (v1.length === 0) {
            return ctor;
          }
          ;
          return "(" + (intercalate4(" ")(append6([ctor])(v1)) + ")");
        }
      };
    };
  };
  var genericShow$prime = function(dict) {
    return dict["genericShow'"];
  };
  var genericShowSum = function(dictGenericShow) {
    var genericShow$prime1 = genericShow$prime(dictGenericShow);
    return function(dictGenericShow1) {
      var genericShow$prime2 = genericShow$prime(dictGenericShow1);
      return {
        "genericShow'": function(v) {
          if (v instanceof Inl) {
            return genericShow$prime1(v.value0);
          }
          ;
          if (v instanceof Inr) {
            return genericShow$prime2(v.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Show.Generic (line 26, column 1 - line 28, column 40): " + [v.constructor.name]);
        }
      };
    };
  };
  var genericShow = function(dictGeneric) {
    var from3 = from(dictGeneric);
    return function(dictGenericShow) {
      var genericShow$prime1 = genericShow$prime(dictGenericShow);
      return function(x) {
        return genericShow$prime1(from3(x));
      };
    };
  };

  // output/Foliage.Common/index.js
  var Opaque = /* @__PURE__ */ function() {
    function Opaque2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Opaque2.create = function(value0) {
      return function(value1) {
        return new Opaque2(value0, value1);
      };
    };
    return Opaque2;
  }();
  var map_Exc_label = function(label5) {
    return function(v) {
      return {
        label: label5,
        source: v.source,
        description: v.description
      };
    };
  };
  var fromOpaque = function(v) {
    return v.value1;
  };
  var _error = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var lookup6 = function(dictOrd) {
    var lookup15 = lookup2(dictOrd);
    return function(dictMonadThrow) {
      var throwError3 = throwError(dictMonadThrow);
      var pure21 = pure(dictMonadThrow.Monad0().Applicative0());
      return function(dictShow) {
        var show11 = show(dictShow);
        return function(label5) {
          return function(x) {
            return function(m) {
              var v = lookup15(x)(m);
              if (v instanceof Nothing) {
                return throwError3({
                  label: _error,
                  source: "lookup",
                  description: label5 + (" not found: " + show11(x))
                });
              }
              ;
              if (v instanceof Just) {
                return pure21(v.value0);
              }
              ;
              throw new Error("Failed pattern match at Foliage.Common (line 55, column 20 - line 57, column 19): " + [v.constructor.name]);
            };
          };
        };
      };
    };
  };
  var _compare = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _apply_rule = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _Show_Opaque = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return {
      show: function(v) {
        return "<" + (reflectSymbol2(v.value0) + ">");
      }
    };
  };
  var _Show_Exc = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return {
      show: function(v) {
        return "[exc . " + (reflectSymbol2(v.label) + ("] " + (v.source + (": " + v.description))));
      }
    };
  };

  // output/Record/index.js
  var set = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function() {
        return function(l) {
          return function(b2) {
            return function(r) {
              return unsafeSet(reflectSymbol2(l))(b2)(r);
            };
          };
        };
      };
    };
  };
  var get2 = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function(l) {
        return function(r) {
          return unsafeGet(reflectSymbol2(l))(r);
        };
      };
    };
  };

  // output/Foliage.Program/index.js
  var bindReaderT2 = /* @__PURE__ */ bindReaderT(bindIdentity);
  var bind3 = /* @__PURE__ */ bind(bindReaderT2);
  var pure6 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeReaderT(applicativeIdentity));
  var pure12 = /* @__PURE__ */ pure(applicativeArray);
  var append13 = /* @__PURE__ */ append(semigroupArray);
  var foldMap3 = /* @__PURE__ */ foldMap2(monoidArray);
  var map14 = /* @__PURE__ */ map(functorEffect);
  var discard4 = /* @__PURE__ */ discard(discardUnit);
  var functorReaderT2 = /* @__PURE__ */ functorReaderT(functorIdentity);
  var map15 = /* @__PURE__ */ map(functorReaderT2);
  var monoidReaderT2 = /* @__PURE__ */ monoidReaderT(applicativeIdentity)(monoidArray);
  var fold3 = /* @__PURE__ */ fold2(monoidReaderT2);
  var append22 = /* @__PURE__ */ append(/* @__PURE__ */ semigroupReaderT(applyIdentity)(semigroupArray));
  var show2 = /* @__PURE__ */ show(showInt);
  var identity12 = /* @__PURE__ */ identity(categoryFn);
  var mempty2 = /* @__PURE__ */ mempty(monoidReaderT2);
  var intercalate5 = /* @__PURE__ */ intercalate2(monoidReaderT2);
  var mapFlipped3 = /* @__PURE__ */ mapFlipped(functorArray);
  var fromFoldable4 = /* @__PURE__ */ fromFoldable(foldableList);
  var mapWithIndex3 = /* @__PURE__ */ mapWithIndex(functorWithIndexMap);
  var mapFlipped1 = /* @__PURE__ */ mapFlipped(functorReaderT2);
  var genericShowConstructor2 = /* @__PURE__ */ genericShowConstructor(genericShowArgsNoArguments);
  var genericShowSum2 = /* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "UnitLatticeType";
    }
  }));
  var SumLatticeTypeIsSymbol = {
    reflectSymbol: function() {
      return "SumLatticeType";
    }
  };
  var ProductLatticeTypeIsSymbol = {
    reflectSymbol: function() {
      return "ProductLatticeType";
    }
  };
  var SetLatticeTypeIsSymbol = {
    reflectSymbol: function() {
      return "SetLatticeType";
    }
  };
  var OppositeLatticeTypeIsSymbol = {
    reflectSymbol: function() {
      return "OppositeLatticeType";
    }
  };
  var DiscreteLatticeTypeIsSymbol = {
    reflectSymbol: function() {
      return "DiscreteLatticeType";
    }
  };
  var PowerLatticeTypeIsSymbol = {
    reflectSymbol: function() {
      return "PowerLatticeType";
    }
  };
  var showRecord2 = /* @__PURE__ */ showRecord()();
  var compare_implIsSymbol = {
    reflectSymbol: function() {
      return "compare_impl";
    }
  };
  var nameIsSymbol = {
    reflectSymbol: function() {
      return "name";
    }
  };
  var showRecordFieldsConsNil2 = /* @__PURE__ */ showRecordFieldsConsNil(nameIsSymbol);
  var genericShowSum1 = /* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "UnitDataType";
    }
  }));
  var SumDataTypeIsSymbol = {
    reflectSymbol: function() {
      return "SumDataType";
    }
  };
  var ProductDataTypeIsSymbol = {
    reflectSymbol: function() {
      return "ProductDataType";
    }
  };
  var SetDataTypeIsSymbol = {
    reflectSymbol: function() {
      return "SetDataType";
    }
  };
  var genericShowArgsArgument2 = /* @__PURE__ */ genericShowArgsArgument(showString);
  var implIsSymbol = {
    reflectSymbol: function() {
      return "impl";
    }
  };
  var inputsIsSymbol = {
    reflectSymbol: function() {
      return "inputs";
    }
  };
  var showRecordFieldsCons2 = /* @__PURE__ */ showRecordFieldsCons(nameIsSymbol);
  var outputIsSymbol = {
    reflectSymbol: function() {
      return "output";
    }
  };
  var VarTermIsSymbol = {
    reflectSymbol: function() {
      return "VarTerm";
    }
  };
  var genericShowSum22 = /* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "UnitTerm";
    }
  }));
  var genericShowArgsProduct2 = /* @__PURE__ */ genericShowArgsProduct(genericShowArgsArgument2);
  var LeftTermIsSymbol = {
    reflectSymbol: function() {
      return "LeftTerm";
    }
  };
  var RightTermIsSymbol = {
    reflectSymbol: function() {
      return "RightTerm";
    }
  };
  var PairTermIsSymbol = {
    reflectSymbol: function() {
      return "PairTerm";
    }
  };
  var SetTermIsSymbol = {
    reflectSymbol: function() {
      return "SetTerm";
    }
  };
  var PropIsSymbol = {
    reflectSymbol: function() {
      return "Prop";
    }
  };
  var map22 = /* @__PURE__ */ map(functorArray);
  var map32 = /* @__PURE__ */ map(functorList);
  var foldl3 = /* @__PURE__ */ foldl(foldableArray);
  var foldr6 = /* @__PURE__ */ foldr(foldableArray);
  var foldMap13 = /* @__PURE__ */ foldMap(foldableArray);
  var traverse2 = /* @__PURE__ */ traverse(traversableArray);
  var foldl12 = /* @__PURE__ */ foldl(foldableList);
  var foldr1 = /* @__PURE__ */ foldr(foldableList);
  var foldMap22 = /* @__PURE__ */ foldMap(foldableList);
  var traverse12 = /* @__PURE__ */ traverse(traversableList);
  var genericEqArgument2 = /* @__PURE__ */ genericEqArgument(eqString);
  var genericEqProduct2 = /* @__PURE__ */ genericEqProduct(genericEqArgument2);
  var bindStateT2 = /* @__PURE__ */ bindStateT(monadIdentity);
  var bind22 = /* @__PURE__ */ bind(bindStateT2);
  var monadStateStateT2 = /* @__PURE__ */ monadStateStateT(monadIdentity);
  var get3 = /* @__PURE__ */ get(monadStateStateT2);
  var discard22 = /* @__PURE__ */ discard4(bindStateT2);
  var modify_4 = /* @__PURE__ */ modify_2(monadStateStateT2);
  var applicativeStateT2 = /* @__PURE__ */ applicativeStateT(monadIdentity);
  var pure32 = /* @__PURE__ */ pure(applicativeStateT2);
  var mapFlipped22 = /* @__PURE__ */ mapFlipped(functorList);
  var argsIsSymbol = {
    reflectSymbol: function() {
      return "args";
    }
  };
  var functionNameIsSymbol = {
    reflectSymbol: function() {
      return "functionName";
    }
  };
  var resultVarVarNameIsSymbol = {
    reflectSymbol: function() {
      return "resultVarVarName";
    }
  };
  var conclusionIsSymbol = {
    reflectSymbol: function() {
      return "conclusion";
    }
  };
  var hypothesesIsSymbol = {
    reflectSymbol: function() {
      return "hypotheses";
    }
  };
  var dataTypeDefsIsSymbol = {
    reflectSymbol: function() {
      return "dataTypeDefs";
    }
  };
  var docIsSymbol = {
    reflectSymbol: function() {
      return "doc";
    }
  };
  var showRecordFieldsCons1 = /* @__PURE__ */ showRecordFieldsCons(docIsSymbol);
  var functionDefsIsSymbol = {
    reflectSymbol: function() {
      return "functionDefs";
    }
  };
  var initialGasIsSymbol = {
    reflectSymbol: function() {
      return "initialGas";
    }
  };
  var latticeTypeDefsIsSymbol = {
    reflectSymbol: function() {
      return "latticeTypeDefs";
    }
  };
  var relationsIsSymbol = {
    reflectSymbol: function() {
      return "relations";
    }
  };
  var rulesIsSymbol = {
    reflectSymbol: function() {
      return "rules";
    }
  };
  var showMaybe2 = /* @__PURE__ */ showMaybe(showString);
  var ask2 = /* @__PURE__ */ ask(/* @__PURE__ */ monadAskReaderT(monadIdentity));
  var discard32 = /* @__PURE__ */ discard4(bindReaderT2);
  var traceM2 = /* @__PURE__ */ traceM()(/* @__PURE__ */ monadReaderT(monadIdentity));
  var show1 = /* @__PURE__ */ show(/* @__PURE__ */ _Show_Exc({
    reflectSymbol: function() {
      return "error";
    }
  }));
  var fold13 = /* @__PURE__ */ fold(foldableList)(monoidReaderT2);
  var mapFlipped32 = /* @__PURE__ */ mapFlipped(functorMaybe);
  var map42 = /* @__PURE__ */ map(functorMap);
  var hypothesisIsSymbol = {
    reflectSymbol: function() {
      return "hypothesis";
    }
  };
  var rule$primeIsSymbol = {
    reflectSymbol: function() {
      return "rule'";
    }
  };
  var VarName = /* @__PURE__ */ function() {
    function VarName2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    VarName2.create = function(value0) {
      return function(value1) {
        return new VarName2(value0, value1);
      };
    };
    return VarName2;
  }();
  var LeftGreaterThanRight_SumLatticeTypeOrdering = /* @__PURE__ */ function() {
    function LeftGreaterThanRight_SumLatticeTypeOrdering2() {
    }
    ;
    LeftGreaterThanRight_SumLatticeTypeOrdering2.value = new LeftGreaterThanRight_SumLatticeTypeOrdering2();
    return LeftGreaterThanRight_SumLatticeTypeOrdering2;
  }();
  var LeftLessThanRight_SumLatticeTypeOrdering = /* @__PURE__ */ function() {
    function LeftLessThanRight_SumLatticeTypeOrdering2() {
    }
    ;
    LeftLessThanRight_SumLatticeTypeOrdering2.value = new LeftLessThanRight_SumLatticeTypeOrdering2();
    return LeftLessThanRight_SumLatticeTypeOrdering2;
  }();
  var LeftIncomparableRight_SumLatticeTypeOrdering = /* @__PURE__ */ function() {
    function LeftIncomparableRight_SumLatticeTypeOrdering2() {
    }
    ;
    LeftIncomparableRight_SumLatticeTypeOrdering2.value = new LeftIncomparableRight_SumLatticeTypeOrdering2();
    return LeftIncomparableRight_SumLatticeTypeOrdering2;
  }();
  var LeftEqualRight_SumLatticeTypeOrdering = /* @__PURE__ */ function() {
    function LeftEqualRight_SumLatticeTypeOrdering2() {
    }
    ;
    LeftEqualRight_SumLatticeTypeOrdering2.value = new LeftEqualRight_SumLatticeTypeOrdering2();
    return LeftEqualRight_SumLatticeTypeOrdering2;
  }();
  var SetOrdering = /* @__PURE__ */ function() {
    function SetOrdering2() {
    }
    ;
    SetOrdering2.value = new SetOrdering2();
    return SetOrdering2;
  }();
  var FirstThenSecond_ProductLatticeTypeOrdering = /* @__PURE__ */ function() {
    function FirstThenSecond_ProductLatticeTypeOrdering2() {
    }
    ;
    FirstThenSecond_ProductLatticeTypeOrdering2.value = new FirstThenSecond_ProductLatticeTypeOrdering2();
    return FirstThenSecond_ProductLatticeTypeOrdering2;
  }();
  var FixedName = function(x) {
    return x;
  };
  var NamedLatticeType = /* @__PURE__ */ function() {
    function NamedLatticeType2(value0) {
      this.value0 = value0;
    }
    ;
    NamedLatticeType2.create = function(value0) {
      return new NamedLatticeType2(value0);
    };
    return NamedLatticeType2;
  }();
  var UnitLatticeType = /* @__PURE__ */ function() {
    function UnitLatticeType2() {
    }
    ;
    UnitLatticeType2.value = new UnitLatticeType2();
    return UnitLatticeType2;
  }();
  var SumLatticeType = /* @__PURE__ */ function() {
    function SumLatticeType2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    SumLatticeType2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new SumLatticeType2(value0, value1, value22);
        };
      };
    };
    return SumLatticeType2;
  }();
  var ProductLatticeType = /* @__PURE__ */ function() {
    function ProductLatticeType2(value0, value1, value22) {
      this.value0 = value0;
      this.value1 = value1;
      this.value2 = value22;
    }
    ;
    ProductLatticeType2.create = function(value0) {
      return function(value1) {
        return function(value22) {
          return new ProductLatticeType2(value0, value1, value22);
        };
      };
    };
    return ProductLatticeType2;
  }();
  var SetLatticeType = /* @__PURE__ */ function() {
    function SetLatticeType2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    SetLatticeType2.create = function(value0) {
      return function(value1) {
        return new SetLatticeType2(value0, value1);
      };
    };
    return SetLatticeType2;
  }();
  var OppositeLatticeType = /* @__PURE__ */ function() {
    function OppositeLatticeType2(value0) {
      this.value0 = value0;
    }
    ;
    OppositeLatticeType2.create = function(value0) {
      return new OppositeLatticeType2(value0);
    };
    return OppositeLatticeType2;
  }();
  var DiscreteLatticeType = /* @__PURE__ */ function() {
    function DiscreteLatticeType2(value0) {
      this.value0 = value0;
    }
    ;
    DiscreteLatticeType2.create = function(value0) {
      return new DiscreteLatticeType2(value0);
    };
    return DiscreteLatticeType2;
  }();
  var PowerLatticeType = /* @__PURE__ */ function() {
    function PowerLatticeType2(value0) {
      this.value0 = value0;
    }
    ;
    PowerLatticeType2.create = function(value0) {
      return new PowerLatticeType2(value0);
    };
    return PowerLatticeType2;
  }();
  var UnitDataType = /* @__PURE__ */ function() {
    function UnitDataType2() {
    }
    ;
    UnitDataType2.value = new UnitDataType2();
    return UnitDataType2;
  }();
  var NamedDataType = /* @__PURE__ */ function() {
    function NamedDataType2(value0) {
      this.value0 = value0;
    }
    ;
    NamedDataType2.create = function(value0) {
      return new NamedDataType2(value0);
    };
    return NamedDataType2;
  }();
  var SumDataType = /* @__PURE__ */ function() {
    function SumDataType2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    SumDataType2.create = function(value0) {
      return function(value1) {
        return new SumDataType2(value0, value1);
      };
    };
    return SumDataType2;
  }();
  var ProductDataType = /* @__PURE__ */ function() {
    function ProductDataType2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ProductDataType2.create = function(value0) {
      return function(value1) {
        return new ProductDataType2(value0, value1);
      };
    };
    return ProductDataType2;
  }();
  var SetDataType = /* @__PURE__ */ function() {
    function SetDataType2(value0) {
      this.value0 = value0;
    }
    ;
    SetDataType2.create = function(value0) {
      return new SetDataType2(value0);
    };
    return SetDataType2;
  }();
  var ExternalDataTypeDef = /* @__PURE__ */ function() {
    function ExternalDataTypeDef2(value0) {
      this.value0 = value0;
    }
    ;
    ExternalDataTypeDef2.create = function(value0) {
      return new ExternalDataTypeDef2(value0);
    };
    return ExternalDataTypeDef2;
  }();
  var DataTypeDef = /* @__PURE__ */ function() {
    function DataTypeDef2(value0) {
      this.value0 = value0;
    }
    ;
    DataTypeDef2.create = function(value0) {
      return new DataTypeDef2(value0);
    };
    return DataTypeDef2;
  }();
  var VarTerm = /* @__PURE__ */ function() {
    function VarTerm2(value0) {
      this.value0 = value0;
    }
    ;
    VarTerm2.create = function(value0) {
      return new VarTerm2(value0);
    };
    return VarTerm2;
  }();
  var UnitTerm = /* @__PURE__ */ function() {
    function UnitTerm2() {
    }
    ;
    UnitTerm2.value = new UnitTerm2();
    return UnitTerm2;
  }();
  var LiteralTerm = /* @__PURE__ */ function() {
    function LiteralTerm2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    LiteralTerm2.create = function(value0) {
      return function(value1) {
        return new LiteralTerm2(value0, value1);
      };
    };
    return LiteralTerm2;
  }();
  var LeftTerm = /* @__PURE__ */ function() {
    function LeftTerm2(value0) {
      this.value0 = value0;
    }
    ;
    LeftTerm2.create = function(value0) {
      return new LeftTerm2(value0);
    };
    return LeftTerm2;
  }();
  var RightTerm = /* @__PURE__ */ function() {
    function RightTerm2(value0) {
      this.value0 = value0;
    }
    ;
    RightTerm2.create = function(value0) {
      return new RightTerm2(value0);
    };
    return RightTerm2;
  }();
  var PairTerm = /* @__PURE__ */ function() {
    function PairTerm2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    PairTerm2.create = function(value0) {
      return function(value1) {
        return new PairTerm2(value0, value1);
      };
    };
    return PairTerm2;
  }();
  var SetTerm = /* @__PURE__ */ function() {
    function SetTerm2(value0) {
      this.value0 = value0;
    }
    ;
    SetTerm2.create = function(value0) {
      return new SetTerm2(value0);
    };
    return SetTerm2;
  }();
  var Prop = /* @__PURE__ */ function() {
    function Prop2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Prop2.create = function(value0) {
      return function(value1) {
        return new Prop2(value0, value1);
      };
    };
    return Prop2;
  }();
  var FunctionSideHypothesis = /* @__PURE__ */ function() {
    function FunctionSideHypothesis2(value0) {
      this.value0 = value0;
    }
    ;
    FunctionSideHypothesis2.create = function(value0) {
      return new FunctionSideHypothesis2(value0);
    };
    return FunctionSideHypothesis2;
  }();
  var Hypothesis = /* @__PURE__ */ function() {
    function Hypothesis2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Hypothesis2.create = function(value0) {
      return function(value1) {
        return new Hypothesis2(value0, value1);
      };
    };
    return Hypothesis2;
  }();
  var Rule = /* @__PURE__ */ function() {
    function Rule2(value0) {
      this.value0 = value0;
    }
    ;
    Rule2.create = function(value0) {
      return new Rule2(value0);
    };
    return Rule2;
  }();
  var RipeRule = /* @__PURE__ */ function() {
    function RipeRule2(value0) {
      this.value0 = value0;
    }
    ;
    RipeRule2.create = function(value0) {
      return new RipeRule2(value0);
    };
    return RipeRule2;
  }();
  var ExternalFunctionDef = /* @__PURE__ */ function() {
    function ExternalFunctionDef2(value0) {
      this.value0 = value0;
    }
    ;
    ExternalFunctionDef2.create = function(value0) {
      return new ExternalFunctionDef2(value0);
    };
    return ExternalFunctionDef2;
  }();
  var LatticeTypeDef = /* @__PURE__ */ function() {
    function LatticeTypeDef2(value0) {
      this.value0 = value0;
    }
    ;
    LatticeTypeDef2.create = function(value0) {
      return new LatticeTypeDef2(value0);
    };
    return LatticeTypeDef2;
  }();
  var ExternalLatticeTypeDef = /* @__PURE__ */ function() {
    function ExternalLatticeTypeDef2(value0) {
      this.value0 = value0;
    }
    ;
    ExternalLatticeTypeDef2.create = function(value0) {
      return new ExternalLatticeTypeDef2(value0);
    };
    return ExternalLatticeTypeDef2;
  }();
  var Module = /* @__PURE__ */ function() {
    function Module2(value0) {
      this.value0 = value0;
    }
    ;
    Module2.create = function(value0) {
      return new Module2(value0);
    };
    return Module2;
  }();
  var Relation = /* @__PURE__ */ function() {
    function Relation2(value0) {
      this.value0 = value0;
    }
    ;
    Relation2.create = function(value0) {
      return new Relation2(value0);
    };
    return Relation2;
  }();
  var Program = /* @__PURE__ */ function() {
    function Program2(value0) {
      this.value0 = value0;
    }
    ;
    Program2.create = function(value0) {
      return new Program2(value0);
    };
    return Program2;
  }();
  var section2 = function(m_es) {
    return bind3(m_es)(function(es) {
      return pure6(pure12(div2([style2(append13(flex_column)(padding_horizontal_big))])(es)));
    });
  };
  var render = function(dict) {
    return dict.render;
  };
  var nextHypothesis = function(v) {
    if (v.value0.hypotheses instanceof Nil) {
      return new Left(v.value0.conclusion);
    }
    ;
    if (v.value0.hypotheses instanceof Cons) {
      return new Right(new RipeRule({
        hypothesis: v.value0.hypotheses.value0,
        "rule'": new Rule({
          conclusion: v.value0.conclusion,
          hypotheses: v.value0.hypotheses.value1
        })
      }));
    }
    ;
    throw new Error("Failed pattern match at Foliage.Program (line 265, column 30 - line 267, column 110): " + [v.value0.hypotheses.constructor.name]);
  };
  var newVarName = function(s) {
    return new VarName(s, 0);
  };
  var mainModuleName = "Main";
  var lookupModule = function(dictIsSymbol) {
    var get1 = get2(dictIsSymbol);
    return function(dictCons) {
      var get22 = get1(dictCons);
      return function(dictOrd) {
        var lookup42 = lookup2(dictOrd);
        return function(label5) {
          return function(k) {
            var $1403 = lookup42(k);
            var $1404 = get22(label5);
            return function($1405) {
              return $1403($1404(function(v) {
                return v.value0;
              }($1405)));
            };
          };
        };
      };
    };
  };
  var line = function(m_es) {
    return bind3(m_es)(function(es) {
      return pure6(pure12(span2([])(foldMap3(function(e) {
        return [e, span2([style2(["white-space: pre"])])([text(" ")])];
      })(es))));
    });
  };
  var from_RipeRule_to_Rule = function(v) {
    return new Rule({
      hypotheses: new Cons(v.value0.hypothesis, v["value0"]["rule'"].value0.hypotheses),
      conclusion: v["value0"]["rule'"].value0.conclusion
    });
  };
  var freshVarNameIndexRef = /* @__PURE__ */ unsafePerformEffect(/* @__PURE__ */ $$new(0));
  var freshenVarName = function(v) {
    return unsafePerformEffect(function __do2() {
      var n = map14(function(i2) {
        return new VarName(v.value0, i2);
      })(read(freshVarNameIndexRef))();
      modify_(function(v1) {
        return v1 + 1 | 0;
      })(freshVarNameIndexRef)();
      return n;
    });
  };
  var doc_block = function(s) {
    return pure6([div2([style2(append13(padding_small)(append13(font_prose)(["max-width: 30em", "background-color: rgba(0, 0, 0, 0.1)", "white-space: pre-wrap"])))])([text(s)])]);
  };
  var divs = function(props) {
    var $1406 = map15(function() {
      var $1408 = div2(props);
      return function($1409) {
        return pure12($1408($1409));
      };
    }());
    return function($1407) {
      return $1406(fold3($1407));
    };
  };
  var append_render = function(dictRender) {
    var render82 = render(dictRender);
    return function(a2) {
      return append22(render82(a2));
    };
  };
  var _Show_FixedName = showString;
  var show3 = /* @__PURE__ */ show(_Show_FixedName);
  var genericShowArgsArgument1 = /* @__PURE__ */ genericShowArgsArgument(_Show_FixedName);
  var genericShowConstructor1 = /* @__PURE__ */ genericShowConstructor(genericShowArgsArgument1);
  var genericShowSum3 = /* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor1({
    reflectSymbol: function() {
      return "NamedLatticeType";
    }
  }));
  var genericShowSum4 = /* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor1({
    reflectSymbol: function() {
      return "NamedDataType";
    }
  }));
  var genericShowArgsProduct1 = /* @__PURE__ */ genericShowArgsProduct(genericShowArgsArgument1);
  var showMap2 = /* @__PURE__ */ showMap(_Show_FixedName);
  var _Render_VarName = {
    render: function(v) {
      if (v.value1 === 0) {
        return pure6(pure12(span2([style2(["color: darkgreen"])])([text(v.value0)])));
      }
      ;
      return pure6(pure12(span2([style2(["color: darkgreen"])])([text(v.value0), sub2([])([text(show2(v.value1))])])));
    }
  };
  var append_render1 = /* @__PURE__ */ append_render(_Render_VarName);
  var _Render_RenderM_Htmls = {
    render: identity12
  };
  var append_render2 = /* @__PURE__ */ append_render(_Render_RenderM_Htmls);
  var _Render_Raw = {
    render: function(v) {
      return pure6([span2([style2(["color: blue"])])([text(v)])]);
    }
  };
  var append_render3 = /* @__PURE__ */ append_render(_Render_Raw);
  var _Render_Punc = {
    render: function(v) {
      return pure6(pure12(span2([style2(append13(bold)(["color: black"]))])([text(v)])));
    }
  };
  var append_render4 = /* @__PURE__ */ append_render(_Render_Punc);
  var render1 = /* @__PURE__ */ render(_Render_Punc);
  var definition = function(mb_doc) {
    return function(m_sort) {
      return function(m_name) {
        return function(m_body) {
          return divs([style2(append13(flex_column)(append13(padding_small)(boundaries)))])([maybe(mempty2)(map15(function() {
            var $1410 = div2([]);
            return function($1411) {
              return pure12($1410($1411));
            };
          }()))(mb_doc), line(append_render2(m_sort)(append_render2(m_name)(append_render4("=")(mempty2)))), section2(m_body)]);
        };
      };
    };
  };
  var _Render_Prim = {
    render: function(v) {
      return pure6(pure12(span2([style2(["color: purple"])])([text(v)])));
    }
  };
  var append_render5 = /* @__PURE__ */ append_render(_Render_Prim);
  var _Render_Lit = {
    render: function(v) {
      return pure6([span2([style2(append13(italic)(["color: brown"]))])([text(v)])]);
    }
  };
  var append_render6 = /* @__PURE__ */ append_render(_Render_Lit);
  var _Render_Term = {
    render: function(v) {
      if (v instanceof VarTerm) {
        return append_render1(v.value0)(mempty2);
      }
      ;
      if (v instanceof LiteralTerm) {
        return append_render6(v.value0)(mempty2);
      }
      ;
      if (v instanceof UnitTerm) {
        return append_render5("\u25CF")(mempty2);
      }
      ;
      if (v instanceof LeftTerm) {
        return append_render4("(")(append_render5("\u261C")(append_render(_Render_Term)(v.value0)(append_render4(")")(mempty2))));
      }
      ;
      if (v instanceof RightTerm) {
        return append_render4("(")(append_render5("\u261E")(append_render(_Render_Term)(v.value0)(append_render4(")")(mempty2))));
      }
      ;
      if (v instanceof PairTerm) {
        return append_render4("\u27E8")(append_render(_Render_Term)(v.value0)(append_render4(",")(append_render(_Render_Term)(v.value1)(append_render4("\u27E9")(mempty2)))));
      }
      ;
      if (v instanceof SetTerm) {
        return append_render4("{")(append_render2(intercalate5(append_render4(",")(mempty2))(mapFlipped3(v.value0)(render(_Render_Term))))(append_render4("}")(mempty2)));
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 697, column 12 - line 704, column 107): " + [v.constructor.name]);
    }
  };
  var append_render7 = /* @__PURE__ */ append_render(_Render_Term);
  var render2 = /* @__PURE__ */ render(_Render_Term);
  var _Render_TermSubst = {
    render: function(m) {
      return function(es) {
        return append_render4("{")(append_render2(es)(append_render4("}")(mempty2)));
      }(intercalate5(append_render4(",")(mempty2))(fromFoldable4(values(mapWithIndex3(function(x) {
        return function(t) {
          return append_render1(x)(append_render4("\u21A6")(append_render7(t)(mempty2)));
        };
      })(m)))));
    }
  };
  var _Render_Htmls = {
    render: pure6
  };
  var _Render_FixedName = {
    render: function(v) {
      return pure6(pure12(span2([style2(["color: #808000"])])([text(v)])));
    }
  };
  var append_render8 = /* @__PURE__ */ append_render(_Render_FixedName);
  var render3 = /* @__PURE__ */ render(_Render_FixedName);
  var _Render_LatticeType = {
    render: function(v) {
      if (v instanceof NamedLatticeType) {
        return append_render8(v.value0)(mempty2);
      }
      ;
      if (v instanceof UnitLatticeType) {
        return append_render5("Unit")(mempty2);
      }
      ;
      if (v instanceof SumLatticeType) {
        var sup2 = function() {
          if (v.value0 instanceof LeftGreaterThanRight_SumLatticeTypeOrdering) {
            return "L>R";
          }
          ;
          if (v.value0 instanceof LeftLessThanRight_SumLatticeTypeOrdering) {
            return "L<R";
          }
          ;
          if (v.value0 instanceof LeftIncomparableRight_SumLatticeTypeOrdering) {
            return "L\u22C8R";
          }
          ;
          if (v.value0 instanceof LeftEqualRight_SumLatticeTypeOrdering) {
            return "L=R";
          }
          ;
          throw new Error("Failed pattern match at Foliage.Program (line 611, column 13 - line 615, column 55): " + [v.value0.constructor.name]);
        }();
        var plus_sup = mapFlipped1(append_render4("+")(pure6([sup([])([text(sup2)])])))(function() {
          var $1412 = span2([]);
          return function($1413) {
            return pure12($1412($1413));
          };
        }());
        return append_render4("(")(append_render(_Render_LatticeType)(v.value1)(append_render2(plus_sup)(append_render(_Render_LatticeType)(v.value2)(append_render4(")")(mempty2)))));
      }
      ;
      if (v instanceof ProductLatticeType) {
        var prod_sup = mapFlipped1(append_render4("\xD7")(pure6([sup([])([text("1,2")])])))(function() {
          var $1414 = span2([]);
          return function($1415) {
            return pure12($1414($1415));
          };
        }());
        return append_render4("(")(append_render(_Render_LatticeType)(v.value1)(append_render2(prod_sup)(append_render(_Render_LatticeType)(v.value2)(append_render4(")")(mempty2)))));
      }
      ;
      if (v instanceof SetLatticeType) {
        return append_render5("Set")(append_render4("(")(append_render(_Render_LatticeType)(v.value1)(append_render4(")")(mempty2))));
      }
      ;
      if (v instanceof OppositeLatticeType) {
        return append_render5("Opposite")(append_render4("(")(append_render(_Render_LatticeType)(v.value0)(append_render4(")")(mempty2))));
      }
      ;
      if (v instanceof DiscreteLatticeType) {
        return append_render5("Discrete")(append_render4("(")(append_render(_Render_LatticeType)(v.value0)(append_render4(")")(mempty2))));
      }
      ;
      if (v instanceof PowerLatticeType) {
        return append_render5("Power")(append_render4("(")(append_render(_Render_LatticeType)(v.value0)(append_render4(")")(mempty2))));
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 603, column 12 - line 626, column 74): " + [v.constructor.name]);
    }
  };
  var append_render9 = /* @__PURE__ */ append_render(_Render_LatticeType);
  var _Render_SideHypothesis = {
    render: function(v) {
      return append_render4("let")(append_render1(v.value0.resultVarVarName)(append_render4("=")(append_render8(v.value0.functionName)(append_render4("(")(append_render2(intercalate5(append_render4(",")(mempty2))(mapFlipped3(v.value0.args)(render2)))(append_render4(")")(mempty2)))))));
    }
  };
  var render4 = /* @__PURE__ */ render(_Render_SideHypothesis);
  var _Render_DataType = {
    render: function(v) {
      if (v instanceof NamedDataType) {
        return append_render8(v.value0)(mempty2);
      }
      ;
      if (v instanceof UnitDataType) {
        return append_render5("Unit")(mempty2);
      }
      ;
      if (v instanceof SumDataType) {
        return append_render4("(")(append_render(_Render_DataType)(v.value0)(append_render4("+")(append_render(_Render_DataType)(v.value1)(append_render4(")")(mempty2)))));
      }
      ;
      if (v instanceof SetDataType) {
        return append_render5("Set")(append_render(_Render_DataType)(v.value0)(mempty2));
      }
      ;
      if (v instanceof ProductDataType) {
        return append_render4("(")(append_render(_Render_DataType)(v.value0)(append_render4("*")(append_render(_Render_DataType)(v.value1)(append_render4(")")(mempty2)))));
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 629, column 12 - line 634, column 75): " + [v.constructor.name]);
    }
  };
  var append_render10 = /* @__PURE__ */ append_render(_Render_DataType);
  var _Ord_FixedName = ordString;
  var lookup12 = /* @__PURE__ */ lookup2(_Ord_FixedName);
  var lookup22 = /* @__PURE__ */ lookup6(_Ord_FixedName)(/* @__PURE__ */ monadThrowExceptT(monadIdentity))(_Show_FixedName);
  var getMainModule = function(v) {
    var v1 = lookup12(mainModuleName)(v.value0.modules);
    if (v1 instanceof Nothing) {
      return unsafeCrashWith("program " + (show3(v.value0.name) + " does not have a Main module"));
    }
    ;
    if (v1 instanceof Just) {
      return v1.value0;
    }
    ;
    throw new Error("Failed pattern match at Foliage.Program (line 60, column 32 - line 62, column 18): " + [v1.constructor.name]);
  };
  var _Generic_VarName = {
    to: function(x) {
      return new VarName(x.value0, x.value1);
    },
    from: function(x) {
      return new Product(x.value0, x.value1);
    }
  };
  var _Generic_TermF = {
    to: function(x) {
      if (x instanceof Inl) {
        return new VarTerm(x.value0);
      }
      ;
      if (x instanceof Inr && x.value0 instanceof Inl) {
        return UnitTerm.value;
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
        return new LiteralTerm(x.value0.value0.value0.value0, x.value0.value0.value0.value1);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inl))) {
        return new LeftTerm(x.value0.value0.value0.value0);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0 instanceof Inl)))) {
        return new RightTerm(x.value0.value0.value0.value0.value0);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && (x.value0.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0.value0 instanceof Inl))))) {
        return new PairTerm(x.value0.value0.value0.value0.value0.value0.value0, x.value0.value0.value0.value0.value0.value0.value1);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && (x.value0.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0.value0 instanceof Inr))))) {
        return new SetTerm(x.value0.value0.value0.value0.value0.value0);
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 356, column 1 - line 356, column 54): " + [x.constructor.name]);
    },
    from: function(x) {
      if (x instanceof VarTerm) {
        return new Inl(x.value0);
      }
      ;
      if (x instanceof UnitTerm) {
        return new Inr(new Inl(NoArguments.value));
      }
      ;
      if (x instanceof LiteralTerm) {
        return new Inr(new Inr(new Inl(new Product(x.value0, x.value1))));
      }
      ;
      if (x instanceof LeftTerm) {
        return new Inr(new Inr(new Inr(new Inl(x.value0))));
      }
      ;
      if (x instanceof RightTerm) {
        return new Inr(new Inr(new Inr(new Inr(new Inl(x.value0)))));
      }
      ;
      if (x instanceof PairTerm) {
        return new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(new Product(x.value0, x.value1)))))));
      }
      ;
      if (x instanceof SetTerm) {
        return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(x.value0))))));
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 356, column 1 - line 356, column 54): " + [x.constructor.name]);
    }
  };
  var genericShow2 = /* @__PURE__ */ genericShow(_Generic_TermF);
  var _Generic_SumLatticeTypeOrdering = {
    to: function(x) {
      if (x instanceof Inl) {
        return LeftGreaterThanRight_SumLatticeTypeOrdering.value;
      }
      ;
      if (x instanceof Inr && x.value0 instanceof Inl) {
        return LeftLessThanRight_SumLatticeTypeOrdering.value;
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
        return LeftIncomparableRight_SumLatticeTypeOrdering.value;
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inr)) {
        return LeftEqualRight_SumLatticeTypeOrdering.value;
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 150, column 1 - line 150, column 84): " + [x.constructor.name]);
    },
    from: function(x) {
      if (x instanceof LeftGreaterThanRight_SumLatticeTypeOrdering) {
        return new Inl(NoArguments.value);
      }
      ;
      if (x instanceof LeftLessThanRight_SumLatticeTypeOrdering) {
        return new Inr(new Inl(NoArguments.value));
      }
      ;
      if (x instanceof LeftIncomparableRight_SumLatticeTypeOrdering) {
        return new Inr(new Inr(new Inl(NoArguments.value)));
      }
      ;
      if (x instanceof LeftEqualRight_SumLatticeTypeOrdering) {
        return new Inr(new Inr(new Inr(NoArguments.value)));
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 150, column 1 - line 150, column 84): " + [x.constructor.name]);
    }
  };
  var genericShow1 = /* @__PURE__ */ genericShow(_Generic_SumLatticeTypeOrdering)(/* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "LeftGreaterThanRight_SumLatticeTypeOrdering";
    }
  }))(/* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "LeftLessThanRight_SumLatticeTypeOrdering";
    }
  }))(/* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "LeftIncomparableRight_SumLatticeTypeOrdering";
    }
  }))(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "LeftEqualRight_SumLatticeTypeOrdering";
    }
  })))));
  var _Show_SumLatticeTypeOrdering = {
    show: function(x) {
      return genericShow1(x);
    }
  };
  var genericShowArgsProduct22 = /* @__PURE__ */ genericShowArgsProduct(/* @__PURE__ */ genericShowArgsArgument(_Show_SumLatticeTypeOrdering));
  var _Generic_SideHypothesisF = {
    to: function(x) {
      return new FunctionSideHypothesis(x);
    },
    from: function(x) {
      return x.value0;
    }
  };
  var _Generic_SetOrdering = {
    to: function(x) {
      return SetOrdering.value;
    },
    from: function(x) {
      return NoArguments.value;
    }
  };
  var genericShow22 = /* @__PURE__ */ genericShow(_Generic_SetOrdering)(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "SetOrdering";
    }
  }));
  var _Show_SetOrdering = {
    show: function(x) {
      return genericShow22(x);
    }
  };
  var genericShowArgsProduct3 = /* @__PURE__ */ genericShowArgsProduct(/* @__PURE__ */ genericShowArgsArgument(_Show_SetOrdering));
  var _Generic_RuleF = {
    to: function(x) {
      return new Rule(x);
    },
    from: function(x) {
      return x.value0;
    }
  };
  var _Generic_RipeRuleF = {
    to: function(x) {
      return new RipeRule(x);
    },
    from: function(x) {
      return x.value0;
    }
  };
  var _Generic_PropF = {
    to: function(x) {
      return new Prop(x.value0, x.value1);
    },
    from: function(x) {
      return new Product(x.value0, x.value1);
    }
  };
  var genericShow3 = /* @__PURE__ */ genericShow(_Generic_PropF);
  var _Generic_ProductLatticeTypeOrdering = {
    to: function(x) {
      return FirstThenSecond_ProductLatticeTypeOrdering.value;
    },
    from: function(x) {
      return NoArguments.value;
    }
  };
  var genericShow4 = /* @__PURE__ */ genericShow(_Generic_ProductLatticeTypeOrdering)(/* @__PURE__ */ genericShowConstructor2({
    reflectSymbol: function() {
      return "FirstThenSecond_ProductLatticeTypeOrdering";
    }
  }));
  var _Show_ProductLatticeTypeOrdering = {
    show: function(x) {
      return genericShow4(x);
    }
  };
  var genericShowArgsProduct4 = /* @__PURE__ */ genericShowArgsProduct(/* @__PURE__ */ genericShowArgsArgument(_Show_ProductLatticeTypeOrdering));
  var _Generic_Module = {
    to: function(x) {
      return new Module(x);
    },
    from: function(x) {
      return x.value0;
    }
  };
  var _Generic_LatticeTypeDef = {
    to: function(x) {
      if (x instanceof Inl) {
        return new LatticeTypeDef(x.value0);
      }
      ;
      if (x instanceof Inr) {
        return new ExternalLatticeTypeDef(x.value0);
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 118, column 1 - line 118, column 68): " + [x.constructor.name]);
    },
    from: function(x) {
      if (x instanceof LatticeTypeDef) {
        return new Inl(x.value0);
      }
      ;
      if (x instanceof ExternalLatticeTypeDef) {
        return new Inr(x.value0);
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 118, column 1 - line 118, column 68): " + [x.constructor.name]);
    }
  };
  var _Generic_LatticeType = {
    to: function(x) {
      if (x instanceof Inl) {
        return new NamedLatticeType(x.value0);
      }
      ;
      if (x instanceof Inr && x.value0 instanceof Inl) {
        return UnitLatticeType.value;
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
        return new SumLatticeType(x.value0.value0.value0.value0, x.value0.value0.value0.value1.value0, x.value0.value0.value0.value1.value1);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inl))) {
        return new ProductLatticeType(x.value0.value0.value0.value0.value0, x.value0.value0.value0.value0.value1.value0, x.value0.value0.value0.value0.value1.value1);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0 instanceof Inl)))) {
        return new SetLatticeType(x.value0.value0.value0.value0.value0.value0, x.value0.value0.value0.value0.value0.value1);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && (x.value0.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0.value0 instanceof Inl))))) {
        return new OppositeLatticeType(x.value0.value0.value0.value0.value0.value0);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && (x.value0.value0.value0.value0 instanceof Inr && (x.value0.value0.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0.value0.value0 instanceof Inl)))))) {
        return new DiscreteLatticeType(x.value0.value0.value0.value0.value0.value0.value0);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && (x.value0.value0.value0 instanceof Inr && (x.value0.value0.value0.value0 instanceof Inr && (x.value0.value0.value0.value0.value0 instanceof Inr && x.value0.value0.value0.value0.value0.value0 instanceof Inr)))))) {
        return new PowerLatticeType(x.value0.value0.value0.value0.value0.value0.value0);
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 136, column 1 - line 136, column 62): " + [x.constructor.name]);
    },
    from: function(x) {
      if (x instanceof NamedLatticeType) {
        return new Inl(x.value0);
      }
      ;
      if (x instanceof UnitLatticeType) {
        return new Inr(new Inl(NoArguments.value));
      }
      ;
      if (x instanceof SumLatticeType) {
        return new Inr(new Inr(new Inl(new Product(x.value0, new Product(x.value1, x.value2)))));
      }
      ;
      if (x instanceof ProductLatticeType) {
        return new Inr(new Inr(new Inr(new Inl(new Product(x.value0, new Product(x.value1, x.value2))))));
      }
      ;
      if (x instanceof SetLatticeType) {
        return new Inr(new Inr(new Inr(new Inr(new Inl(new Product(x.value0, x.value1))))));
      }
      ;
      if (x instanceof OppositeLatticeType) {
        return new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x.value0))))));
      }
      ;
      if (x instanceof DiscreteLatticeType) {
        return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x.value0)))))));
      }
      ;
      if (x instanceof PowerLatticeType) {
        return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(x.value0)))))));
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 136, column 1 - line 136, column 62): " + [x.constructor.name]);
    }
  };
  var genericShow5 = /* @__PURE__ */ genericShow(_Generic_LatticeType);
  var _Show_LatticeType = {
    show: function(x) {
      return genericShow5(genericShowSum3(genericShowSum2(genericShowSum(genericShowConstructor(genericShowArgsProduct22(genericShowArgsProduct(genericShowArgsArgument(_Show_LatticeType))(genericShowArgsArgument(_Show_LatticeType))))(SumLatticeTypeIsSymbol))(genericShowSum(genericShowConstructor(genericShowArgsProduct4(genericShowArgsProduct(genericShowArgsArgument(_Show_LatticeType))(genericShowArgsArgument(_Show_LatticeType))))(ProductLatticeTypeIsSymbol))(genericShowSum(genericShowConstructor(genericShowArgsProduct3(genericShowArgsArgument(_Show_LatticeType)))(SetLatticeTypeIsSymbol))(genericShowSum(genericShowConstructor(genericShowArgsArgument(_Show_LatticeType))(OppositeLatticeTypeIsSymbol))(genericShowSum(genericShowConstructor(genericShowArgsArgument(_Show_LatticeType))(DiscreteLatticeTypeIsSymbol))(genericShowConstructor(genericShowArgsArgument(_Show_LatticeType))(PowerLatticeTypeIsSymbol)))))))))(x);
    }
  };
  var genericShow6 = /* @__PURE__ */ genericShow(_Generic_LatticeTypeDef)(/* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsArgument(_Show_LatticeType))({
    reflectSymbol: function() {
      return "LatticeTypeDef";
    }
  }))(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsArgument(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons(compare_implIsSymbol)(/* @__PURE__ */ showRecordFieldsConsNil2(showString))(/* @__PURE__ */ _Show_Opaque({
    reflectSymbol: function() {
      return "compare";
    }
  })))))({
    reflectSymbol: function() {
      return "ExternalLatticeTypeDef";
    }
  })));
  var show4 = /* @__PURE__ */ show(_Show_LatticeType);
  var _Show_LatticeTypeDef = {
    show: function(x) {
      return genericShow6(x);
    }
  };
  var _Show_Relation = {
    show: function(v) {
      return "(Relation " + (show4(v.value0.domain) + ")");
    }
  };
  var _Generic_HypothesisF = {
    to: function(x) {
      return new Hypothesis(x.value0, x.value1);
    },
    from: function(x) {
      return new Product(x.value0, x.value1);
    }
  };
  var _Generic_FunctionDef = {
    to: function(x) {
      return new ExternalFunctionDef(x);
    },
    from: function(x) {
      return x.value0;
    }
  };
  var _Generic_DataTypeDef = {
    to: function(x) {
      if (x instanceof Inl) {
        return new ExternalDataTypeDef(x.value0);
      }
      ;
      if (x instanceof Inr) {
        return new DataTypeDef(x.value0);
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 88, column 1 - line 88, column 62): " + [x.constructor.name]);
    },
    from: function(x) {
      if (x instanceof ExternalDataTypeDef) {
        return new Inl(x.value0);
      }
      ;
      if (x instanceof DataTypeDef) {
        return new Inr(x.value0);
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 88, column 1 - line 88, column 62): " + [x.constructor.name]);
    }
  };
  var _Generic_DataType = {
    to: function(x) {
      if (x instanceof Inl) {
        return UnitDataType.value;
      }
      ;
      if (x instanceof Inr && x.value0 instanceof Inl) {
        return new NamedDataType(x.value0.value0);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
        return new SumDataType(x.value0.value0.value0.value0, x.value0.value0.value0.value1);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inl))) {
        return new ProductDataType(x.value0.value0.value0.value0.value0, x.value0.value0.value0.value0.value1);
      }
      ;
      if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inr))) {
        return new SetDataType(x.value0.value0.value0.value0);
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 103, column 1 - line 103, column 56): " + [x.constructor.name]);
    },
    from: function(x) {
      if (x instanceof UnitDataType) {
        return new Inl(NoArguments.value);
      }
      ;
      if (x instanceof NamedDataType) {
        return new Inr(new Inl(x.value0));
      }
      ;
      if (x instanceof SumDataType) {
        return new Inr(new Inr(new Inl(new Product(x.value0, x.value1))));
      }
      ;
      if (x instanceof ProductDataType) {
        return new Inr(new Inr(new Inr(new Inl(new Product(x.value0, x.value1)))));
      }
      ;
      if (x instanceof SetDataType) {
        return new Inr(new Inr(new Inr(new Inr(x.value0))));
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 103, column 1 - line 103, column 56): " + [x.constructor.name]);
    }
  };
  var genericShow7 = /* @__PURE__ */ genericShow(_Generic_DataType);
  var _Show_DataType = {
    show: function(x) {
      return genericShow7(genericShowSum1(genericShowSum4(genericShowSum(genericShowConstructor(genericShowArgsProduct(genericShowArgsArgument(_Show_DataType))(genericShowArgsArgument(_Show_DataType)))(SumDataTypeIsSymbol))(genericShowSum(genericShowConstructor(genericShowArgsProduct(genericShowArgsArgument(_Show_DataType))(genericShowArgsArgument(_Show_DataType)))(ProductDataTypeIsSymbol))(genericShowConstructor(genericShowArgsArgument(_Show_DataType))(SetDataTypeIsSymbol))))))(x);
    }
  };
  var genericShowArgsArgument22 = /* @__PURE__ */ genericShowArgsArgument(_Show_DataType);
  var genericShow8 = /* @__PURE__ */ genericShow(_Generic_DataTypeDef)(/* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor(genericShowArgsArgument2)({
    reflectSymbol: function() {
      return "ExternalDataTypeDef";
    }
  }))(/* @__PURE__ */ genericShowConstructor(genericShowArgsArgument22)({
    reflectSymbol: function() {
      return "DataTypeDef";
    }
  })));
  var genericShow9 = /* @__PURE__ */ genericShow(_Generic_FunctionDef)(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsArgument(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons(implIsSymbol)(/* @__PURE__ */ showRecordFieldsCons(inputsIsSymbol)(/* @__PURE__ */ showRecordFieldsCons2(/* @__PURE__ */ showRecordFieldsConsNil(outputIsSymbol)(_Show_DataType))(showString))(/* @__PURE__ */ showArray(/* @__PURE__ */ showTuple(showString)(_Show_DataType))))(/* @__PURE__ */ _Show_Opaque({
    reflectSymbol: function() {
      return "function";
    }
  })))))({
    reflectSymbol: function() {
      return "ExternalFunctionDef";
    }
  }));
  var genericShowSum5 = /* @__PURE__ */ genericShowSum(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsProduct2(genericShowArgsArgument22))({
    reflectSymbol: function() {
      return "LiteralTerm";
    }
  }));
  var _Show_DataTypeDef = {
    show: function(x) {
      return genericShow8(x);
    }
  };
  var _Show_FunctionDef = {
    show: function(x) {
      return genericShow9(x);
    }
  };
  var _Show_Term = function(dictShow) {
    var genericShowSum6 = genericShowSum(genericShowConstructor(genericShowArgsArgument(dictShow))(VarTermIsSymbol));
    return {
      show: function(x) {
        return genericShow2(genericShowSum6(genericShowSum22(genericShowSum5(genericShowSum(genericShowConstructor(genericShowArgsArgument(_Show_Term(dictShow)))(LeftTermIsSymbol))(genericShowSum(genericShowConstructor(genericShowArgsArgument(_Show_Term(dictShow)))(RightTermIsSymbol))(genericShowSum(genericShowConstructor(genericShowArgsProduct(genericShowArgsArgument(_Show_Term(dictShow)))(genericShowArgsArgument(_Show_Term(dictShow))))(PairTermIsSymbol))(genericShowConstructor(genericShowArgsArgument(showArray(_Show_Term(dictShow))))(SetTermIsSymbol))))))))(x);
      }
    };
  };
  var _Show_PropF = function(dictShow) {
    var genericShow16 = genericShow3(genericShowConstructor(genericShowArgsProduct1(genericShowArgsArgument(_Show_Term(dictShow))))(PropIsSymbol));
    return {
      show: function(x) {
        return genericShow16(x);
      }
    };
  };
  var _Functor_TermF = {
    map: function(f) {
      return function(m) {
        if (m instanceof VarTerm) {
          return new VarTerm(f(m.value0));
        }
        ;
        if (m instanceof UnitTerm) {
          return UnitTerm.value;
        }
        ;
        if (m instanceof LiteralTerm) {
          return new LiteralTerm(m.value0, m.value1);
        }
        ;
        if (m instanceof LeftTerm) {
          return new LeftTerm(map(_Functor_TermF)(f)(m.value0));
        }
        ;
        if (m instanceof RightTerm) {
          return new RightTerm(map(_Functor_TermF)(f)(m.value0));
        }
        ;
        if (m instanceof PairTerm) {
          return new PairTerm(map(_Functor_TermF)(f)(m.value0), map(_Functor_TermF)(f)(m.value1));
        }
        ;
        if (m instanceof SetTerm) {
          return new SetTerm(map22(map(_Functor_TermF)(f))(m.value0));
        }
        ;
        throw new Error("Failed pattern match at Foliage.Program (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };
  var map52 = /* @__PURE__ */ map(_Functor_TermF);
  var _Functor_SideHypothesisF = {
    map: function(f) {
      return function(m) {
        return new FunctionSideHypothesis({
          functionName: m.value0.functionName,
          args: map22(map52(f))(m.value0.args),
          resultVarVarName: f(m.value0.resultVarVarName)
        });
      };
    }
  };
  var map62 = /* @__PURE__ */ map(_Functor_SideHypothesisF);
  var _Functor_PropF = {
    map: function(f) {
      return function(m) {
        return new Prop(m.value0, map52(f)(m.value1));
      };
    }
  };
  var map72 = /* @__PURE__ */ map(_Functor_PropF);
  var _Functor_HypothesisF = {
    map: function(f) {
      return function(m) {
        return new Hypothesis(map72(f)(m.value0), map22(map62(f))(m.value1));
      };
    }
  };
  var map82 = /* @__PURE__ */ map(_Functor_HypothesisF);
  var _Functor_RuleF = {
    map: function(f) {
      return function(m) {
        return new Rule({
          conclusion: map72(f)(m.value0.conclusion),
          hypotheses: map32(map82(f))(m.value0.hypotheses)
        });
      };
    }
  };
  var map92 = /* @__PURE__ */ map(_Functor_RuleF);
  var _Functor_RipeRuleF = {
    map: function(f) {
      return function(m) {
        return new RipeRule({
          hypothesis: map82(f)(m.value0.hypothesis),
          "rule'": map92(f)(m["value0"]["rule'"])
        });
      };
    }
  };
  var _Foldable_TermF = {
    foldl: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof VarTerm) {
            return f(z)(m.value0);
          }
          ;
          if (m instanceof UnitTerm) {
            return z;
          }
          ;
          if (m instanceof LiteralTerm) {
            return z;
          }
          ;
          if (m instanceof LeftTerm) {
            return foldl(_Foldable_TermF)(f)(z)(m.value0);
          }
          ;
          if (m instanceof RightTerm) {
            return foldl(_Foldable_TermF)(f)(z)(m.value0);
          }
          ;
          if (m instanceof PairTerm) {
            return foldl(_Foldable_TermF)(f)(foldl(_Foldable_TermF)(f)(z)(m.value0))(m.value1);
          }
          ;
          if (m instanceof SetTerm) {
            return foldl3(foldl(_Foldable_TermF)(f))(z)(m.value0);
          }
          ;
          throw new Error("Failed pattern match at Foliage.Program (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
        };
      };
    },
    foldr: function(f) {
      return function(z) {
        return function(m) {
          if (m instanceof VarTerm) {
            return f(m.value0)(z);
          }
          ;
          if (m instanceof UnitTerm) {
            return z;
          }
          ;
          if (m instanceof LiteralTerm) {
            return z;
          }
          ;
          if (m instanceof LeftTerm) {
            return foldr(_Foldable_TermF)(f)(z)(m.value0);
          }
          ;
          if (m instanceof RightTerm) {
            return foldr(_Foldable_TermF)(f)(z)(m.value0);
          }
          ;
          if (m instanceof PairTerm) {
            return foldr(_Foldable_TermF)(f)(foldr(_Foldable_TermF)(f)(z)(m.value1))(m.value0);
          }
          ;
          if (m instanceof SetTerm) {
            return foldr6(flip(foldr(_Foldable_TermF)(f)))(z)(m.value0);
          }
          ;
          throw new Error("Failed pattern match at Foliage.Program (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var mempty12 = mempty(dictMonoid);
      var append32 = append(dictMonoid.Semigroup0());
      var foldMap8 = foldMap13(dictMonoid);
      return function(f) {
        return function(m) {
          if (m instanceof VarTerm) {
            return f(m.value0);
          }
          ;
          if (m instanceof UnitTerm) {
            return mempty12;
          }
          ;
          if (m instanceof LiteralTerm) {
            return mempty12;
          }
          ;
          if (m instanceof LeftTerm) {
            return foldMap(_Foldable_TermF)(dictMonoid)(f)(m.value0);
          }
          ;
          if (m instanceof RightTerm) {
            return foldMap(_Foldable_TermF)(dictMonoid)(f)(m.value0);
          }
          ;
          if (m instanceof PairTerm) {
            return append32(foldMap(_Foldable_TermF)(dictMonoid)(f)(m.value0))(foldMap(_Foldable_TermF)(dictMonoid)(f)(m.value1));
          }
          ;
          if (m instanceof SetTerm) {
            return foldMap8(foldMap(_Foldable_TermF)(dictMonoid)(f))(m.value0);
          }
          ;
          throw new Error("Failed pattern match at Foliage.Program (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
        };
      };
    }
  };
  var foldl22 = /* @__PURE__ */ foldl(_Foldable_TermF);
  var foldr22 = /* @__PURE__ */ foldr(_Foldable_TermF);
  var foldMap32 = /* @__PURE__ */ foldMap(_Foldable_TermF);
  var _Traversable_TermF = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var map102 = map(Apply0.Functor0());
      var pure52 = pure(dictApplicative);
      var apply2 = apply(Apply0);
      var traverse72 = traverse2(dictApplicative);
      return function(f) {
        return function(m) {
          if (m instanceof VarTerm) {
            return map102(function(v1) {
              return new VarTerm(v1);
            })(f(m.value0));
          }
          ;
          if (m instanceof UnitTerm) {
            return pure52(UnitTerm.value);
          }
          ;
          if (m instanceof LiteralTerm) {
            return pure52(new LiteralTerm(m.value0, m.value1));
          }
          ;
          if (m instanceof LeftTerm) {
            return map102(function(v1) {
              return new LeftTerm(v1);
            })(traverse(_Traversable_TermF)(dictApplicative)(f)(m.value0));
          }
          ;
          if (m instanceof RightTerm) {
            return map102(function(v1) {
              return new RightTerm(v1);
            })(traverse(_Traversable_TermF)(dictApplicative)(f)(m.value0));
          }
          ;
          if (m instanceof PairTerm) {
            return apply2(map102(function(v2) {
              return function(v3) {
                return new PairTerm(v2, v3);
              };
            })(traverse(_Traversable_TermF)(dictApplicative)(f)(m.value0)))(traverse(_Traversable_TermF)(dictApplicative)(f)(m.value1));
          }
          ;
          if (m instanceof SetTerm) {
            return map102(function(v1) {
              return new SetTerm(v1);
            })(traverse72(traverse(_Traversable_TermF)(dictApplicative)(f))(m.value0));
          }
          ;
          throw new Error("Failed pattern match at Foliage.Program (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
        };
      };
    },
    sequence: function(dictApplicative) {
      return function(v) {
        return traverse(_Traversable_TermF)(dictApplicative)(identity12)(v);
      };
    },
    Functor0: function() {
      return _Functor_TermF;
    },
    Foldable1: function() {
      return _Foldable_TermF;
    }
  };
  var traverse22 = /* @__PURE__ */ traverse(_Traversable_TermF);
  var _Foldable_SideHypothesisF = {
    foldl: function(f) {
      return function(z) {
        return function(m) {
          return f(foldl3(foldl22(f))(z)(m.value0.args))(m.value0.resultVarVarName);
        };
      };
    },
    foldr: function(f) {
      return function(z) {
        return function(m) {
          return foldr6(flip(foldr22(f)))(f(m.value0.resultVarVarName)(z))(m.value0.args);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var append32 = append(dictMonoid.Semigroup0());
      var foldMap8 = foldMap13(dictMonoid);
      var foldMap9 = foldMap32(dictMonoid);
      return function(f) {
        return function(m) {
          return append32(foldMap8(foldMap9(f))(m.value0.args))(f(m.value0.resultVarVarName));
        };
      };
    }
  };
  var foldl32 = /* @__PURE__ */ foldl(_Foldable_SideHypothesisF);
  var foldr32 = /* @__PURE__ */ foldr(_Foldable_SideHypothesisF);
  var foldMap4 = /* @__PURE__ */ foldMap(_Foldable_SideHypothesisF);
  var _Traversable_SideHypothesisF = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var apply2 = apply(Apply0);
      var map102 = map(Apply0.Functor0());
      var traverse72 = traverse2(dictApplicative);
      var traverse8 = traverse22(dictApplicative);
      return function(f) {
        return function(m) {
          return apply2(map102(function(v1) {
            return function(v2) {
              return new FunctionSideHypothesis({
                functionName: m.value0.functionName,
                args: v1,
                resultVarVarName: v2
              });
            };
          })(traverse72(traverse8(f))(m.value0.args)))(f(m.value0.resultVarVarName));
        };
      };
    },
    sequence: function(dictApplicative) {
      return function(v) {
        return traverse(_Traversable_SideHypothesisF)(dictApplicative)(identity12)(v);
      };
    },
    Functor0: function() {
      return _Functor_SideHypothesisF;
    },
    Foldable1: function() {
      return _Foldable_SideHypothesisF;
    }
  };
  var traverse3 = /* @__PURE__ */ traverse(_Traversable_SideHypothesisF);
  var _Foldable_PropF = {
    foldl: function(f) {
      return function(z) {
        return function(m) {
          return foldl22(f)(z)(m.value1);
        };
      };
    },
    foldr: function(f) {
      return function(z) {
        return function(m) {
          return foldr22(f)(z)(m.value1);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var foldMap8 = foldMap32(dictMonoid);
      return function(f) {
        return function(m) {
          return foldMap8(f)(m.value1);
        };
      };
    }
  };
  var foldl4 = /* @__PURE__ */ foldl(_Foldable_PropF);
  var foldr42 = /* @__PURE__ */ foldr(_Foldable_PropF);
  var foldMap5 = /* @__PURE__ */ foldMap(_Foldable_PropF);
  var _Traversable_PropF = {
    traverse: function(dictApplicative) {
      var map102 = map(dictApplicative.Apply0().Functor0());
      var traverse72 = traverse22(dictApplicative);
      return function(f) {
        return function(m) {
          return map102(function(v2) {
            return new Prop(m.value0, v2);
          })(traverse72(f)(m.value1));
        };
      };
    },
    sequence: function(dictApplicative) {
      return function(v) {
        return traverse(_Traversable_PropF)(dictApplicative)(identity12)(v);
      };
    },
    Functor0: function() {
      return _Functor_PropF;
    },
    Foldable1: function() {
      return _Foldable_PropF;
    }
  };
  var traverse4 = /* @__PURE__ */ traverse(_Traversable_PropF);
  var _Foldable_HypothesisF = {
    foldl: function(f) {
      return function(z) {
        return function(m) {
          return foldl3(foldl32(f))(foldl4(f)(z)(m.value0))(m.value1);
        };
      };
    },
    foldr: function(f) {
      return function(z) {
        return function(m) {
          return foldr42(f)(foldr6(flip(foldr32(f)))(z)(m.value1))(m.value0);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var append32 = append(dictMonoid.Semigroup0());
      var foldMap8 = foldMap5(dictMonoid);
      var foldMap9 = foldMap13(dictMonoid);
      var foldMap10 = foldMap4(dictMonoid);
      return function(f) {
        return function(m) {
          return append32(foldMap8(f)(m.value0))(foldMap9(foldMap10(f))(m.value1));
        };
      };
    }
  };
  var foldl5 = /* @__PURE__ */ foldl(_Foldable_HypothesisF);
  var foldr52 = /* @__PURE__ */ foldr(_Foldable_HypothesisF);
  var foldMap6 = /* @__PURE__ */ foldMap(_Foldable_HypothesisF);
  var _Foldable_RuleF = {
    foldl: function(f) {
      return function(z) {
        return function(m) {
          return foldl12(foldl5(f))(foldl4(f)(z)(m.value0.conclusion))(m.value0.hypotheses);
        };
      };
    },
    foldr: function(f) {
      return function(z) {
        return function(m) {
          return foldr42(f)(foldr1(flip(foldr52(f)))(z)(m.value0.hypotheses))(m.value0.conclusion);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var append32 = append(dictMonoid.Semigroup0());
      var foldMap8 = foldMap5(dictMonoid);
      var foldMap9 = foldMap22(dictMonoid);
      var foldMap10 = foldMap6(dictMonoid);
      return function(f) {
        return function(m) {
          return append32(foldMap8(f)(m.value0.conclusion))(foldMap9(foldMap10(f))(m.value0.hypotheses));
        };
      };
    }
  };
  var foldl6 = /* @__PURE__ */ foldl(_Foldable_RuleF);
  var foldr62 = /* @__PURE__ */ foldr(_Foldable_RuleF);
  var foldMap7 = /* @__PURE__ */ foldMap(_Foldable_RuleF);
  var _Foldable_RipeRuleF = {
    foldl: function(f) {
      return function(z) {
        return function(m) {
          return foldl6(f)(foldl5(f)(z)(m.value0.hypothesis))(m["value0"]["rule'"]);
        };
      };
    },
    foldr: function(f) {
      return function(z) {
        return function(m) {
          return foldr52(f)(foldr62(f)(z)(m["value0"]["rule'"]))(m.value0.hypothesis);
        };
      };
    },
    foldMap: function(dictMonoid) {
      var append32 = append(dictMonoid.Semigroup0());
      var foldMap8 = foldMap6(dictMonoid);
      var foldMap9 = foldMap7(dictMonoid);
      return function(f) {
        return function(m) {
          return append32(foldMap8(f)(m.value0.hypothesis))(foldMap9(f)(m["value0"]["rule'"]));
        };
      };
    }
  };
  var _Traversable_HypothesisF = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var apply2 = apply(Apply0);
      var map102 = map(Apply0.Functor0());
      var traverse72 = traverse4(dictApplicative);
      var traverse8 = traverse2(dictApplicative);
      var traverse9 = traverse3(dictApplicative);
      return function(f) {
        return function(m) {
          return apply2(map102(function(v2) {
            return function(v3) {
              return new Hypothesis(v2, v3);
            };
          })(traverse72(f)(m.value0)))(traverse8(traverse9(f))(m.value1));
        };
      };
    },
    sequence: function(dictApplicative) {
      return function(v) {
        return traverse(_Traversable_HypothesisF)(dictApplicative)(identity12)(v);
      };
    },
    Functor0: function() {
      return _Functor_HypothesisF;
    },
    Foldable1: function() {
      return _Foldable_HypothesisF;
    }
  };
  var traverse5 = /* @__PURE__ */ traverse(_Traversable_HypothesisF);
  var _Traversable_RuleF = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var apply2 = apply(Apply0);
      var map102 = map(Apply0.Functor0());
      var traverse72 = traverse4(dictApplicative);
      var traverse8 = traverse12(dictApplicative);
      var traverse9 = traverse5(dictApplicative);
      return function(f) {
        return function(m) {
          return apply2(map102(function(v1) {
            return function(v2) {
              return new Rule({
                conclusion: v1,
                hypotheses: v2
              });
            };
          })(traverse72(f)(m.value0.conclusion)))(traverse8(traverse9(f))(m.value0.hypotheses));
        };
      };
    },
    sequence: function(dictApplicative) {
      return function(v) {
        return traverse(_Traversable_RuleF)(dictApplicative)(identity12)(v);
      };
    },
    Functor0: function() {
      return _Functor_RuleF;
    },
    Foldable1: function() {
      return _Foldable_RuleF;
    }
  };
  var traverse6 = /* @__PURE__ */ traverse(_Traversable_RuleF);
  var _Traversable_RipeRuleF = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      var apply2 = apply(Apply0);
      var map102 = map(Apply0.Functor0());
      var traverse72 = traverse5(dictApplicative);
      var traverse8 = traverse6(dictApplicative);
      return function(f) {
        return function(m) {
          return apply2(map102(function(v1) {
            return function(v2) {
              return new RipeRule({
                hypothesis: v1,
                "rule'": v2
              });
            };
          })(traverse72(f)(m.value0.hypothesis)))(traverse8(f)(m["value0"]["rule'"]));
        };
      };
    },
    sequence: function(dictApplicative) {
      return function(v) {
        return traverse(_Traversable_RipeRuleF)(dictApplicative)(identity12)(v);
      };
    },
    Functor0: function() {
      return _Functor_RipeRuleF;
    },
    Foldable1: function() {
      return _Foldable_RipeRuleF;
    }
  };
  var _Eq_VarName = {
    eq: /* @__PURE__ */ genericEq(_Generic_VarName)(/* @__PURE__ */ genericEqConstructor(/* @__PURE__ */ genericEqProduct2(/* @__PURE__ */ genericEqArgument(eqInt))))
  };
  var _Ord_VarName = {
    compare: /* @__PURE__ */ genericCompare(_Generic_VarName)(/* @__PURE__ */ genericOrdConstructor(/* @__PURE__ */ genericOrdProduct(/* @__PURE__ */ genericOrdArgument(ordString))(/* @__PURE__ */ genericOrdArgument(ordInt)))),
    Eq0: function() {
      return _Eq_VarName;
    }
  };
  var lookup32 = /* @__PURE__ */ lookup2(_Ord_VarName);
  var insert4 = /* @__PURE__ */ insert(_Ord_VarName);
  var freshenVarNames = function(dictShow) {
    return function(dictTraversable) {
      var traverse72 = traverse(dictTraversable)(applicativeStateT2);
      return function(t) {
        var f = function(x) {
          return bind22(get3)(function(sigma) {
            var v = lookup32(x)(sigma);
            if (v instanceof Nothing) {
              var y = freshenVarName(x);
              return discard22(modify_4(insert4(x)(y)))(function() {
                return pure32(y);
              });
            }
            ;
            if (v instanceof Just) {
              return pure32(v.value0);
            }
            ;
            throw new Error("Failed pattern match at Foliage.Program (line 420, column 5 - line 427, column 15): " + [v.constructor.name]);
          });
        };
        return flip(evalState)(empty3)(traverse72(f)(t));
      };
    };
  };
  var substTerm = function(v) {
    return function(v1) {
      if (v1 instanceof VarTerm) {
        return fromMaybe(new VarTerm(v1.value0))(lookup32(v1.value0)(v));
      }
      ;
      if (v1 instanceof LiteralTerm) {
        return new LiteralTerm(v1.value0, v1.value1);
      }
      ;
      if (v1 instanceof UnitTerm) {
        return UnitTerm.value;
      }
      ;
      if (v1 instanceof LeftTerm) {
        return new LeftTerm(substTerm(v)(v1.value0));
      }
      ;
      if (v1 instanceof RightTerm) {
        return new RightTerm(substTerm(v)(v1.value0));
      }
      ;
      if (v1 instanceof PairTerm) {
        return new PairTerm(substTerm(v)(v1.value0), substTerm(v)(v1.value1));
      }
      ;
      if (v1 instanceof SetTerm) {
        return new SetTerm(mapFlipped3(v1.value0)(substTerm(v)));
      }
      ;
      throw new Error("Failed pattern match at Foliage.Program (line 387, column 1 - line 387, column 39): " + [v.constructor.name, v1.constructor.name]);
    };
  };
  var substProp = function(sigma) {
    return function(v) {
      return new Prop(v.value0, substTerm(sigma)(v.value1));
    };
  };
  var substSideHypothesis = function(sigma) {
    return function(v) {
      return new FunctionSideHypothesis({
        resultVarVarName: v.value0.resultVarVarName,
        functionName: v.value0.functionName,
        args: mapFlipped3(v.value0.args)(substTerm(sigma))
      });
    };
  };
  var substHypothesis = function(sigma) {
    return function(v) {
      return new Hypothesis(substProp(sigma)(v.value0), mapFlipped3(v.value1)(substSideHypothesis(sigma)));
    };
  };
  var substRule = function(sigma) {
    return function(v) {
      return new Rule({
        hypotheses: mapFlipped22(v.value0.hypotheses)(substHypothesis(sigma)),
        conclusion: substProp(sigma)(v.value0.conclusion)
      });
    };
  };
  var _Eq_Show = {
    show: /* @__PURE__ */ genericShow(_Generic_VarName)(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsProduct2(/* @__PURE__ */ genericShowArgsArgument(showInt)))({
      reflectSymbol: function() {
        return "VarName";
      }
    }))
  };
  var _Show_Term1 = /* @__PURE__ */ _Show_Term(_Eq_Show);
  var genericShow10 = /* @__PURE__ */ genericShow(_Generic_SideHypothesisF)(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsArgument(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons(argsIsSymbol)(/* @__PURE__ */ showRecordFieldsCons(functionNameIsSymbol)(/* @__PURE__ */ showRecordFieldsConsNil(resultVarVarNameIsSymbol)(_Eq_Show))(_Show_FixedName))(/* @__PURE__ */ showArray(_Show_Term1)))))({
    reflectSymbol: function() {
      return "FunctionSideHypothesis";
    }
  }));
  var _Show_PropF1 = /* @__PURE__ */ _Show_PropF(_Eq_Show);
  var _Show_SideHypothesis = {
    show: function(x) {
      return genericShow10(x);
    }
  };
  var genericShow11 = /* @__PURE__ */ genericShow(_Generic_HypothesisF)(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsProduct(/* @__PURE__ */ genericShowArgsArgument(_Show_PropF1))(/* @__PURE__ */ genericShowArgsArgument(/* @__PURE__ */ showArray(_Show_SideHypothesis))))({
    reflectSymbol: function() {
      return "Hypothesis";
    }
  }));
  var _Show_Hypothesis = {
    show: function(x) {
      return genericShow11(x);
    }
  };
  var genericShow12 = /* @__PURE__ */ genericShow(_Generic_RuleF)(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsArgument(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons(conclusionIsSymbol)(/* @__PURE__ */ showRecordFieldsConsNil(hypothesesIsSymbol)(/* @__PURE__ */ showList(_Show_Hypothesis)))(_Show_PropF1))))({
    reflectSymbol: function() {
      return "Rule";
    }
  }));
  var _Show_Rule = {
    show: function(x) {
      return genericShow12(x);
    }
  };
  var genericShow13 = /* @__PURE__ */ genericShow(_Generic_Module)(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsArgument(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons(dataTypeDefsIsSymbol)(/* @__PURE__ */ showRecordFieldsCons1(/* @__PURE__ */ showRecordFieldsCons(functionDefsIsSymbol)(/* @__PURE__ */ showRecordFieldsCons(initialGasIsSymbol)(/* @__PURE__ */ showRecordFieldsCons(latticeTypeDefsIsSymbol)(/* @__PURE__ */ showRecordFieldsCons2(/* @__PURE__ */ showRecordFieldsCons(relationsIsSymbol)(/* @__PURE__ */ showRecordFieldsConsNil(rulesIsSymbol)(/* @__PURE__ */ showMap2(_Show_Rule)))(/* @__PURE__ */ showMap2(_Show_Relation)))(_Show_FixedName))(/* @__PURE__ */ showMap2(_Show_LatticeTypeDef)))(showInt))(/* @__PURE__ */ showMap2(_Show_FunctionDef)))(showMaybe2))(/* @__PURE__ */ showMap2(_Show_DataTypeDef)))))({
    reflectSymbol: function() {
      return "Module";
    }
  }));
  var genericShow14 = /* @__PURE__ */ genericShow(_Generic_RipeRuleF)(/* @__PURE__ */ genericShowConstructor(/* @__PURE__ */ genericShowArgsArgument(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons(hypothesisIsSymbol)(/* @__PURE__ */ showRecordFieldsConsNil(rule$primeIsSymbol)(_Show_Rule))(_Show_Hypothesis))))({
    reflectSymbol: function() {
      return "RipeRule";
    }
  }));
  var _Show_Module = {
    show: function(x) {
      return genericShow13(x);
    }
  };
  var show6 = /* @__PURE__ */ show(_Show_Module);
  var _Render_Prop = {
    render: function(v) {
      return bind3(ask2)(function(v1) {
        return discard32(traceM2(show6(new Module(v1.mod.value0))))(function() {
          return bind3(either(function(exc) {
            return unsafeCrashWith(show1(exc));
          })(pure6)(runExcept(lookup22("relations")(v.value0)(v1.mod.value0.relations))))(function(v2) {
            return v2.value0.render(v.value1);
          });
        });
      });
    }
  };
  var append_render11 = /* @__PURE__ */ append_render(_Render_Prop);
  var _Render_Hypothesis = {
    render: function(v) {
      return append_render2(line(append_render11(v.value0)(mempty2)))(append_render2(fold3(map22(function($1416) {
        return line(render4($1416));
      })(v.value1)))(mempty2));
    }
  };
  var render5 = /* @__PURE__ */ render(_Render_Hypothesis);
  var _Render_Rule = {
    render: function(v) {
      return bind3(line(append_render11(v.value0.conclusion)(mempty2)))(function(conclusion) {
        return bind3(fold13(map32(render5)(v.value0.hypotheses)))(function(hypotheses) {
          return pure6([div2([style2(flex_column)])(function() {
            var $1370 = $$null(v.value0.hypotheses);
            if ($1370) {
              return conclusion;
            }
            ;
            return concat([hypotheses, [div2([style2(horizontal_bar)])([])], conclusion]);
          }())]);
        });
      });
    }
  };
  var render6 = /* @__PURE__ */ render(_Render_Rule);
  var _Render_Module = {
    render: function(v) {
      return definition(mapFlipped32(v.value0.doc)(doc_block))(render1("module"))(render3(v.value0.name))(function() {
        var renderModDefinition = function(label5) {
          return function(renderBody) {
            return function(items2) {
              return fold3(fromFoldable4(values(mapWithIndex3(function(name16) {
                return function(body2) {
                  return definition(Nothing.value)(label5)(render3(name16))(renderBody(body2));
                };
              })(items2))));
            };
          };
        };
        return fold3([renderModDefinition(append_render4("data type")(mempty2))(function(v1) {
          if (v1 instanceof DataTypeDef) {
            return line(append_render10(v1.value0)(mempty2));
          }
          ;
          if (v1 instanceof ExternalDataTypeDef) {
            return line(append_render4("external")(append_render3(v1.value0)(mempty2)));
          }
          ;
          throw new Error("Failed pattern match at Foliage.Program (line 552, column 65 - line 554, column 87): " + [v1.constructor.name]);
        })(v.value0.dataTypeDefs), renderModDefinition(append_render4("function")(mempty2))(function(v1) {
          return line(append_render3(v1.value0.name)(append_render4("(")(append_render2(intercalate5(append_render4(",")(mempty2))(mapFlipped3(v1.value0.inputs)(function(v2) {
            return append_render3(v2.value0)(append_render4(":")(append_render10(v2.value1)(mempty2)));
          })))(append_render4(")")(append_render4("\u2192")(append_render10(v1.value0.output)(mempty2)))))));
        })(v.value0.functionDefs), renderModDefinition(append_render4("lattice type")(mempty2))(function(v1) {
          if (v1 instanceof LatticeTypeDef) {
            return line(append_render9(v1.value0)(mempty2));
          }
          ;
          if (v1 instanceof ExternalLatticeTypeDef) {
            return line(append_render4("external")(append_render3(v1.value0.name)(mempty2)));
          }
          ;
          throw new Error("Failed pattern match at Foliage.Program (line 559, column 68 - line 561, column 95): " + [v1.constructor.name]);
        })(v.value0.latticeTypeDefs), renderModDefinition(append_render4("relation")(mempty2))(function(v1) {
          return bind3(line(append_render4("\u211B")(append_render9(v1.value0.domain)(mempty2))))(function(verbose) {
            return bind3(line(append_render4("notation:")(v1.value0.render(v1.value0.canonical_term))))(function(pretty) {
              return pure6([div2([style2(flex_column)])([div2([])(verbose), div2([])(pretty)])]);
            });
          });
        })(v.value0.relations), renderModDefinition(append_render4("rule")(mempty2))(function(rule) {
          return map15(function() {
            var $1417 = div2([style2(["display: inline-flex", "flex-direction: row"])]);
            return function($1418) {
              return pure12($1417($1418));
            };
          }())(render6(rule));
        })(v.value0.rules)]);
      }());
    }
  };
  var render7 = /* @__PURE__ */ render(_Render_Module);
  var _Render_Program = {
    render: function(v) {
      return divs([style2(append13(flex_column)(["gap: 1.0em"]))])([line(append_render4("program")(append_render8(v.value0.name)(mempty2))), maybe(mempty2)(doc_block)(v.value0.doc), fold3(fromFoldable4(values(map42(render7)(v.value0.modules))))]);
    }
  };
  var _Show_RipeRule = {
    show: function(x) {
      return genericShow14(x);
    }
  };
  var _Eq_FixedName = eqString;

  // output/Foliage.App.Editor.Component/index.js
  var discard5 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var modify_5 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var append7 = /* @__PURE__ */ append(semigroupArray);
  var map16 = /* @__PURE__ */ map(functorArray);
  var render8 = /* @__PURE__ */ render(_Render_Program);
  var bind4 = /* @__PURE__ */ bind(bindHalogenM);
  var get4 = /* @__PURE__ */ get(monadStateHalogenM);
  var pure7 = /* @__PURE__ */ pure(applicativeHalogenM);
  var log4 = /* @__PURE__ */ log2(/* @__PURE__ */ monadEffectHalogenM(monadEffectAff));
  var GetProgram = /* @__PURE__ */ function() {
    function GetProgram2(value0) {
      this.value0 = value0;
    }
    ;
    GetProgram2.create = function(value0) {
      return new GetProgram2(value0);
    };
    return GetProgram2;
  }();
  var UpdatedProgram = /* @__PURE__ */ function() {
    function UpdatedProgram2(value0) {
      this.value0 = value0;
    }
    ;
    UpdatedProgram2.create = function(value0) {
      return new UpdatedProgram2(value0);
    };
    return UpdatedProgram2;
  }();
  var component2 = /* @__PURE__ */ function() {
    var set_program = function(program) {
      return discard5(modify_5(function(v) {
        var $16 = {};
        for (var $17 in v) {
          if ({}.hasOwnProperty.call(v, $17)) {
            $16[$17] = v[$17];
          }
          ;
        }
        ;
        $16.program = program;
        return $16;
      }))(function() {
        return raise(new UpdatedProgram(program));
      });
    };
    var render14 = function(state3) {
      return div2([style2(append7(font_code)(append7(flex_column)(["gap: 1.0em"])))])(concat([[div2([style2(flex_row)])(/* @__PURE__ */ function() {
        var button3 = function(onClick2) {
          return function(label5) {
            return div2([])([button2([onClick(onClick2), style2(button)])([text(label5)])]);
          };
        };
        return [];
      }())], function() {
        if (state3.load_error instanceof Nothing) {
          return [];
        }
        ;
        if (state3.load_error instanceof Just) {
          return [div2([style2(color_error)])([text(state3.load_error.value0)])];
        }
        ;
        throw new Error("Failed pattern match at Foliage.App.Editor.Component (line 150, column 13 - line 152, column 89): " + [state3.load_error.constructor.name]);
      }(), [div2([style2(append7(flex_column)(["overflow: scroll"]))])(function() {
        var renderCtx = {
          mod: getMainModule(state3.program)
        };
        return map16(fromPlainHTML)(flip(runReader)(renderCtx)(render8(state3.program)));
      }())]]));
    };
    var initialState = function(input3) {
      return {
        program: fromMaybe(new Program({
          name: mainModuleName,
          doc: Nothing.value,
          modules: singleton6(mainModuleName)(new Module({
            name: mainModuleName,
            doc: Nothing.value,
            initialGas: 40,
            dataTypeDefs: empty3,
            latticeTypeDefs: empty3,
            functionDefs: empty3,
            relations: empty3,
            rules: empty3
          }))
        }))(input3.program),
        load_error: Nothing.value
      };
    };
    var handleQuery = function(v) {
      return bind4(get4)(function(v1) {
        return pure7(new Just(v.value0(v1.program)));
      });
    };
    var handleAction = function(v) {
      return discard5(log4("[Editor.SetProgram]"))(function() {
        return set_program(v.value0);
      });
    };
    var $$eval = mkEval({
      receive: defaultEval.receive,
      initialize: defaultEval.initialize,
      finalize: defaultEval.finalize,
      handleAction,
      handleQuery
    });
    return mkComponent({
      initialState,
      "eval": $$eval,
      render: render14
    });
  }();

  // output/Foliage.App.Viewer.Component/index.js
  var discard6 = /* @__PURE__ */ discard(discardUnit)(bindHalogenM);
  var modify_6 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var pure8 = /* @__PURE__ */ pure(applicativeHalogenM);
  var append8 = /* @__PURE__ */ append(semigroupArray);
  var fromFoldable5 = /* @__PURE__ */ fromFoldable(foldableList);
  var map17 = /* @__PURE__ */ map(functorList);
  var render9 = /* @__PURE__ */ render(_Render_Prop);
  var fold4 = /* @__PURE__ */ fold(foldableList)(monoidList);
  var render12 = /* @__PURE__ */ render(_Render_Rule);
  var show5 = /* @__PURE__ */ show(/* @__PURE__ */ _Show_Exc({
    reflectSymbol: function() {
      return "error";
    }
  }));
  var OkResult = /* @__PURE__ */ function() {
    function OkResult2(value0) {
      this.value0 = value0;
    }
    ;
    OkResult2.create = function(value0) {
      return new OkResult2(value0);
    };
    return OkResult2;
  }();
  var PendingResult = /* @__PURE__ */ function() {
    function PendingResult2() {
    }
    ;
    PendingResult2.value = new PendingResult2();
    return PendingResult2;
  }();
  var ErrResult = /* @__PURE__ */ function() {
    function ErrResult2(value0) {
      this.value0 = value0;
    }
    ;
    ErrResult2.create = function(value0) {
      return new ErrResult2(value0);
    };
    return ErrResult2;
  }();
  var SetResult = /* @__PURE__ */ function() {
    function SetResult2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    SetResult2.create = function(value0) {
      return function(value1) {
        return new SetResult2(value0, value1);
      };
    };
    return SetResult2;
  }();
  var SetIntermediateEnv = /* @__PURE__ */ function() {
    function SetIntermediateEnv2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    SetIntermediateEnv2.create = function(value0) {
      return function(value1) {
        return new SetIntermediateEnv2(value0, value1);
      };
    };
    return SetIntermediateEnv2;
  }();
  var Ran = /* @__PURE__ */ function() {
    function Ran2() {
    }
    ;
    Ran2.value = new Ran2();
    return Ran2;
  }();
  var Run = /* @__PURE__ */ function() {
    function Run2() {
    }
    ;
    Run2.value = new Run2();
    return Run2;
  }();
  var component3 = /* @__PURE__ */ function() {
    var initialState = function(input3) {
      return {
        result: Nothing.value,
        intermediate_env: Nothing.value,
        program: input3.program
      };
    };
    var handleQuery = function(v) {
      if (v instanceof SetResult) {
        return discard6(modify_6(function(v1) {
          var $25 = {};
          for (var $26 in v1) {
            if ({}.hasOwnProperty.call(v1, $26)) {
              $25[$26] = v1[$26];
            }
            ;
          }
          ;
          $25.result = v.value0;
          return $25;
        }))(function() {
          return pure8(new Just(v.value1));
        });
      }
      ;
      if (v instanceof SetIntermediateEnv) {
        return discard6(modify_6(function(v1) {
          var $30 = {};
          for (var $31 in v1) {
            if ({}.hasOwnProperty.call(v1, $31)) {
              $30[$31] = v1[$31];
            }
            ;
          }
          ;
          $30.intermediate_env = v.value0;
          return $30;
        }))(function() {
          return pure8(new Just(v.value1));
        });
      }
      ;
      throw new Error("Failed pattern match at Foliage.App.Viewer.Component (line 63, column 17 - line 69, column 20): " + [v.constructor.name]);
    };
    var handleAction = function(v) {
      return raise(Ran.value);
    };
    var getRenderCtx = function(state3) {
      return {
        mod: getMainModule(state3.program)
      };
    };
    var renderEnv = function(state3) {
      return function(v) {
        return [div2([style2(flex_column)])(concat([append8([div2([style2(bold)])([text("known_props")])])(fromFoldable5(map17(function() {
          var $52 = flip(runReader)(getRenderCtx(state3));
          return function($53) {
            return fromPlainHTML(span_($52(line(render9($53)))));
          };
        }())(fold4(values(v.known_props))))), append8([div2([style2(bold)])([text("active_props")])])(fromFoldable5(map17(function(v1) {
          return div2([style2(flex_row)])([div2([])([text("[new:" + (function() {
            if (v1.isNew) {
              return "T";
            }
            ;
            return "F";
          }() + "]"))]), fromPlainHTML(div2([])(flip(runReader)(getRenderCtx(state3))(line(render9(v1.prop)))))]);
        })(v.active_props))), append8([div2([style2(bold)])([text("ripe_rules")])])(fromFoldable5(map17(function() {
          var $54 = div2([style2(flex_column)]);
          var $55 = map17(function() {
            var $57 = div2([style2(append8(margin_small)(append8(padding_small)(boundaries)))]);
            var $58 = flip(runReader)(getRenderCtx(state3));
            return function($59) {
              return fromPlainHTML($57($58(render12(from_RipeRule_to_Rule($59)))));
            };
          }());
          return function($56) {
            return $54(fromFoldable5($55($56)));
          };
        }())(values(v.ripe_rules))))]))];
      };
    };
    var render23 = function(state3) {
      return div2([style2(append8(font_code)(append8(flex_column)(["gap: 1.0em"])))])(concat([[div2([])([div2([style2(flex_row)])([div2([])([button2([onClick($$const(Run.value)), style2(button)])([text("Run")])])])])], [div2([style2(append8(font_code)(append8(flex_column)(["overflow: scroll"])))])(function() {
        if (state3.intermediate_env instanceof Just) {
          return renderEnv(state3)(state3.intermediate_env.value0);
        }
        ;
        if (state3.intermediate_env instanceof Nothing) {
          if (state3.result instanceof Nothing) {
            return [];
          }
          ;
          if (state3.result instanceof Just && state3.result.value0 instanceof ErrResult) {
            if (state3.result.value0.value0.env instanceof Nothing) {
              return [text(show5(state3.result.value0.value0.err))];
            }
            ;
            if (state3.result.value0.value0.env instanceof Just) {
              return append8(renderEnv(state3)(state3.result.value0.value0.env.value0))([text(show5(state3.result.value0.value0.err))]);
            }
            ;
            throw new Error("Failed pattern match at Foliage.App.Viewer.Component (line 132, column 43 - line 134, column 82): " + [state3.result.value0.value0.env.constructor.name]);
          }
          ;
          if (state3.result instanceof Just && state3.result.value0 instanceof PendingResult) {
            return [div2([style2(font_prose)])([text("running...")])];
          }
          ;
          if (state3.result instanceof Just && state3.result.value0 instanceof OkResult) {
            return renderEnv(state3)(state3.result.value0.value0.env);
          }
          ;
          throw new Error("Failed pattern match at Foliage.App.Viewer.Component (line 130, column 28 - line 139, column 65): " + [state3.result.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Foliage.App.Viewer.Component (line 128, column 103 - line 139, column 65): " + [state3.intermediate_env.constructor.name]);
      }())]]));
    };
    var $$eval = mkEval({
      receive: defaultEval.receive,
      initialize: defaultEval.initialize,
      finalize: defaultEval.finalize,
      handleQuery,
      handleAction
    });
    return mkComponent({
      initialState,
      "eval": $$eval,
      render: render23
    });
  }();

  // output/Data.Homogeneous.Record/index.js
  var map18 = /* @__PURE__ */ map(functorObject);
  var functorHomogeneous = {
    map: function(f) {
      return function(m) {
        return map18(f)(m);
      };
    }
  };
  var homogeneous = function() {
    return function(r) {
      return r;
    };
  };
  var fromHomogeneous = function() {
    return function(v) {
      return v;
    };
  };

  // output/Unsafe/index.js
  var intercalate6 = /* @__PURE__ */ intercalate2(monoidString);
  var todo = function(msg) {
    var header2 = fromCharArray(replicate(20)("="));
    return unsafeCrashWith(intercalate6("\n")([header2, "[TODO]", msg, header2]));
  };
  var fromJust5 = function(msg) {
    return function(v) {
      if (v instanceof Nothing) {
        return unsafeCrashWith("[unsafe] fromJust Nothing: " + msg);
      }
      ;
      if (v instanceof Just) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Unsafe (line 17, column 16 - line 19, column 14): " + [v.constructor.name]);
    };
  };

  // output/Foliage.Example.Library/index.js
  var termUnit = /* @__PURE__ */ function() {
    return UnitTerm.value;
  }();
  var sumLIR = /* @__PURE__ */ function() {
    return SumLatticeType.create(LeftIncomparableRight_SumLatticeTypeOrdering.value);
  }();
  var right = /* @__PURE__ */ function() {
    return RightTerm.create;
  }();
  var prod12 = /* @__PURE__ */ function() {
    return ProductLatticeType.create(FirstThenSecond_ProductLatticeTypeOrdering.value);
  }();
  var pair = /* @__PURE__ */ function() {
    return PairTerm.create;
  }();
  var ltyUnit = /* @__PURE__ */ function() {
    return UnitLatticeType.value;
  }();
  var left = /* @__PURE__ */ function() {
    return LeftTerm.create;
  }();

  // output/Foliage.Example.Parsing/index.js
  var fromHomogeneous2 = /* @__PURE__ */ fromHomogeneous();
  var map19 = /* @__PURE__ */ map(functorHomogeneous);
  var homogeneous2 = /* @__PURE__ */ homogeneous();
  var bind5 = /* @__PURE__ */ bind(/* @__PURE__ */ bindReaderT(bindIdentity));
  var render10 = /* @__PURE__ */ render(_Render_Term);
  var append_render12 = /* @__PURE__ */ append_render(_Render_Htmls);
  var append_render13 = /* @__PURE__ */ append_render(_Render_Term);
  var mempty3 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidReaderT(applicativeIdentity)(monoidArray));
  var show7 = /* @__PURE__ */ show(/* @__PURE__ */ _Show_Term(_Eq_Show));
  var show12 = /* @__PURE__ */ show(showInt);
  var mempty1 = /* @__PURE__ */ mempty(monoidList);
  var eq2 = /* @__PURE__ */ eq(_Eq_FixedName);
  var monadExceptT2 = /* @__PURE__ */ monadExceptT(monadIdentity);
  var bind23 = /* @__PURE__ */ bind(/* @__PURE__ */ bindExceptT(monadExceptT2));
  var throwError1 = /* @__PURE__ */ throwError(/* @__PURE__ */ monadThrowExceptT(monadExceptT2));
  var show22 = /* @__PURE__ */ show(showString);
  var pure13 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadExceptT2));
  var compare12 = /* @__PURE__ */ compare(ordInt);
  var empty7 = /* @__PURE__ */ empty(/* @__PURE__ */ plusMap(_Ord_VarName));
  var compare2 = /* @__PURE__ */ compare(ordString);
  var intercalate7 = /* @__PURE__ */ intercalate2(monoidString);
  var fromFoldable1 = /* @__PURE__ */ fromFoldable3(_Ord_FixedName)(foldableArray);
  var append_render22 = /* @__PURE__ */ append_render(_Render_RenderM_Htmls);
  var fromFoldable22 = /* @__PURE__ */ fromFoldable2(foldableArray);
  var name3 = /* @__PURE__ */ fromHomogeneous2(/* @__PURE__ */ map19(FixedName)(/* @__PURE__ */ homogeneous2({
    Int: "Int",
    Index: "Index",
    "Symbol": "Symbol",
    Token: "Token",
    Parse: "Parse",
    "String": "String",
    Ast: "Ast"
  })));
  var token = function(str) {
    return function(i2) {
      return function(j) {
        return new Prop(name3.Token, pair(str)(pair(i2)(j)));
      };
    };
  };
  var ltySymbol = /* @__PURE__ */ function() {
    return new NamedLatticeType(name3["Symbol"]);
  }();
  var ltyString = /* @__PURE__ */ function() {
    return new NamedLatticeType(name3["String"]);
  }();
  var ltyInt = /* @__PURE__ */ function() {
    return new NamedLatticeType(name3.Int);
  }();
  var ltyIndex = /* @__PURE__ */ function() {
    return new NamedLatticeType(name3.Index);
  }();
  var relation_Token = /* @__PURE__ */ function() {
    return new Tuple(name3.Token, new Relation({
      domain: prod12(ltySymbol)(prod12(ltyIndex)(ltyIndex)),
      render: function(v) {
        if (v instanceof PairTerm && v.value1 instanceof PairTerm) {
          return bind5(render10(v.value1.value0))(function(i01) {
            return bind5(render10(v.value1.value1))(function(i11) {
              return append_render12([sub_(i01)])(append_render13(v.value0)(append_render12([sub_(i11)])(mempty3)));
            });
          });
        }
        ;
        return unsafeCrashWith("invalid Token term: " + show7(v));
      },
      canonical_term: pair(new VarTerm(newVarName("s")))(pair(new VarTerm(newVarName("i0")))(new VarTerm(newVarName("i1"))))
    }));
  }();
  var ltyAst = /* @__PURE__ */ function() {
    return new NamedLatticeType(name3.Ast);
  }();
  var relation_Parse = function(dictRender) {
    var append_render32 = append_render(dictRender);
    return function(renderAst) {
      return new Tuple(name3.Parse, new Relation({
        domain: prod12(ltyAst)(prod12(ltyIndex)(ltyIndex)),
        render: function(v) {
          if (v instanceof PairTerm && v.value1 instanceof PairTerm) {
            return bind5(render10(v.value1.value0))(function(i01) {
              return bind5(render10(v.value1.value1))(function(i11) {
                return append_render12([sub_(i01)])(append_render32(renderAst(v.value0))(append_render12([sub_(i11)])(mempty3)));
              });
            });
          }
          ;
          return unsafeCrashWith("invalid Parse term: " + show7(v));
        },
        canonical_term: pair(new VarTerm(newVarName("ast")))(pair(new VarTerm(newVarName("i0")))(new VarTerm(newVarName("i1"))))
      }));
    };
  };
  var latticeTypeDef_Symbol = /* @__PURE__ */ function() {
    return new Tuple(name3["Symbol"], new LatticeTypeDef(new DiscreteLatticeType(ltyString)));
  }();
  var latticeTypeDef_Index = /* @__PURE__ */ function() {
    return new Tuple(name3.Index, new LatticeTypeDef(new DiscreteLatticeType(ltyInt)));
  }();
  var dtyString = /* @__PURE__ */ function() {
    return new NamedDataType(name3["String"]);
  }();
  var dataTypeDef_String = /* @__PURE__ */ function() {
    return new Tuple(name3["String"], new ExternalDataTypeDef("String"));
  }();
  var dataTypeDef_Int = /* @__PURE__ */ function() {
    return new Tuple(name3.Int, new ExternalDataTypeDef("Int"));
  }();
  var compileInput = function(ss) {
    return mapWithIndex2(function(i2) {
      return function(s) {
        return new Tuple(s + ("#" + show12(i2)), new Rule({
          hypotheses: mempty1,
          conclusion: token(new LiteralTerm(s, new NamedDataType(name3["String"])))(new LiteralTerm(show12(i2), new NamedDataType(name3.Int)))(new LiteralTerm(show12(i2 + 1 | 0), new NamedDataType(name3.Int)))
        }));
      };
    })(ss);
  };
  var compare3 = /* @__PURE__ */ function() {
    return fromHomogeneous2(map19(Opaque.create($$Proxy.value))(homogeneous2({
      Int: function(v) {
        if (v.value0 instanceof LiteralTerm && (v.value0.value1 instanceof NamedDataType && (v.value1 instanceof LiteralTerm && (v.value1.value1 instanceof NamedDataType && (eq2(v.value0.value1.value0)(name3.Int) && eq2(v.value1.value1.value0)(name3.Int)))))) {
          return bind23(maybe(throwError1({
            label: _error,
            source: "compare.Int",
            description: show22(v.value0.value0) + " is not an Int"
          }))(pure13)(fromString(v.value0.value0)))(function(x1) {
            return bind23(maybe(throwError1({
              label: _error,
              source: "compare.Int",
              description: show22(v.value1.value0) + " is not an Int"
            }))(pure13)(fromString(v.value1.value0)))(function(x2) {
              return pure13(new Tuple(compare12(x1)(x2), empty7));
            });
          });
        }
        ;
        return throwError1({
          label: _error,
          source: "compare.Int",
          description: "inputs are not literal Ints: " + (show7(v.value0) + (", " + show7(v.value1)))
        });
      },
      "String": function(v) {
        if (v.value0 instanceof LiteralTerm && (v.value0.value1 instanceof NamedDataType && (v.value1 instanceof LiteralTerm && (v.value1.value1 instanceof NamedDataType && (eq2(v.value0.value1.value0)(name3["String"]) && eq2(v.value1.value1.value0)(name3["String"])))))) {
          return pure13(new Tuple(compare2(v.value0.value0)(v.value1.value0), empty7));
        }
        ;
        return throwError1({
          label: _error,
          source: "compare.String",
          description: "inputs are not literal Strings: " + (show7(v.value0) + (", " + show7(v.value1)))
        });
      }
    })));
  }();
  var latticeTypeDef_Int = /* @__PURE__ */ function() {
    return new Tuple(name3.Int, new ExternalLatticeTypeDef({
      name: "Int",
      compare_impl: compare3.Int
    }));
  }();
  var latticeTypeDef_String = /* @__PURE__ */ function() {
    return new Tuple(name3["String"], new ExternalLatticeTypeDef({
      name: "String",
      compare_impl: compare3["String"]
    }));
  }();
  var make_example = function(dictRender) {
    var relation_Parse1 = relation_Parse(dictRender);
    return function(spec) {
      return new Program({
        name: "Parsing . Nat",
        doc: new Just(intercalate7("\n")(concat([["This program implements a parser for the following context-free grammar:", "", "  N \u2192 Z", "  N \u2192 SN", "", "The input string is: ", "", "    " + intercalate7("")(spec.input), ""]]))),
        modules: singleton6(mainModuleName)(new Module({
          name: mainModuleName,
          doc: Nothing.value,
          initialGas: 40,
          dataTypeDefs: fromFoldable1([dataTypeDef_Int, dataTypeDef_String]),
          latticeTypeDefs: fromFoldable1(concat([[latticeTypeDef_Int, latticeTypeDef_String, latticeTypeDef_Symbol, latticeTypeDef_Index], spec.latticeTypeDefs])),
          functionDefs: fromFoldable1([]),
          relations: fromFoldable1([relation_Token, relation_Parse1(spec.renderAst)]),
          rules: fromFoldable1(concat([compileInput(spec.input), spec.rules]))
        }))
      });
    };
  };
  var make_example1 = /* @__PURE__ */ make_example(_Render_RenderM_Htmls);
  var nat = /* @__PURE__ */ defer2(function(v) {
    var renderAst = function(v1) {
      if (v1 instanceof LeftTerm) {
        return append_render12([text("S")])(append_render22(renderAst(v1.value0))(mempty3));
      }
      ;
      if (v1 instanceof RightTerm) {
        return append_render12([text("Z")])(mempty3);
      }
      ;
      return render10(v1);
    };
    var parse7 = function(ast) {
      return function(i2) {
        return function(j) {
          return new Prop(name3.Parse, pair(ast)(pair(i2)(j)));
        };
      };
    };
    var rules = [function() {
      var i1 = newVarName("i1");
      var i0 = newVarName("i0");
      return new Tuple("Z", new Rule({
        hypotheses: fromFoldable22([new Hypothesis(token(new LiteralTerm("Z", dtyString))(new VarTerm(i0))(new VarTerm(i1)), [])]),
        conclusion: parse7(right(termUnit))(new VarTerm(i0))(new VarTerm(i1))
      }));
    }(), function() {
      var n = newVarName("n");
      var i2 = newVarName("i2");
      var i1 = newVarName("i1");
      var i0 = newVarName("i0");
      return new Tuple("S", new Rule({
        hypotheses: fromFoldable22([new Hypothesis(token(new LiteralTerm("S", dtyString))(new VarTerm(i0))(new VarTerm(i1)), []), new Hypothesis(parse7(new VarTerm(n))(new VarTerm(i1))(new VarTerm(i2)), [])]),
        conclusion: parse7(left(new VarTerm(n)))(new VarTerm(i0))(new VarTerm(i2))
      }));
    }()];
    var latticeTypeDefs = [new Tuple(name3.Ast, new LatticeTypeDef(sumLIR(ltyAst)(ltyUnit)))];
    var input3 = ["S", "S", "Z"];
    return make_example1({
      input: input3,
      latticeTypeDefs,
      renderAst,
      rules
    });
  });

  // output/Data.Lens.Internal.Forget/index.js
  var profunctorForget = {
    dimap: function(f) {
      return function(v) {
        return function(v1) {
          return function($36) {
            return v1(f($36));
          };
        };
      };
    }
  };
  var strongForget = {
    first: function(v) {
      return function($37) {
        return v(fst($37));
      };
    },
    second: function(v) {
      return function($38) {
        return v(snd($38));
      };
    },
    Profunctor0: function() {
      return profunctorForget;
    }
  };

  // output/Data.Profunctor.Strong/index.js
  var first = function(dict) {
    return dict.first;
  };

  // output/Data.Lens.Getter/index.js
  var unwrap4 = /* @__PURE__ */ unwrap();
  var identity13 = /* @__PURE__ */ identity(categoryFn);
  var view = function(l) {
    return unwrap4(l(identity13));
  };
  var viewOn = function(s) {
    return function(l) {
      return view(l)(s);
    };
  };

  // output/Data.Lens.Lens/index.js
  var lens$prime = function(to) {
    return function(dictStrong) {
      var dimap2 = dimap(dictStrong.Profunctor0());
      var first2 = first(dictStrong);
      return function(pab) {
        return dimap2(to)(function(v) {
          return v.value1(v.value0);
        })(first2(pab));
      };
    };
  };
  var lens = function(get5) {
    return function(set2) {
      return function(dictStrong) {
        return lens$prime(function(s) {
          return new Tuple(get5(s), function(b2) {
            return set2(s)(b2);
          });
        })(dictStrong);
      };
    };
  };

  // output/Data.Lens.Record/index.js
  var prop3 = function(dictIsSymbol) {
    var get5 = get2(dictIsSymbol)();
    var set2 = set(dictIsSymbol)()();
    return function() {
      return function() {
        return function(l) {
          return function(dictStrong) {
            return lens(get5(l))(flip(set2(l)))(dictStrong);
          };
        };
      };
    };
  };

  // output/Foliage.Interpretation/index.js
  var show8 = /* @__PURE__ */ show(_Show_LatticeType);
  var show13 = /* @__PURE__ */ show(/* @__PURE__ */ _Show_Term(_Eq_Show));
  var foldr7 = /* @__PURE__ */ foldr(foldableList);
  var traverse7 = /* @__PURE__ */ traverse(_Traversable_TermF);
  var show23 = /* @__PURE__ */ show(_Eq_Show);
  var lift6 = /* @__PURE__ */ lift(monadTransExceptT);
  var show32 = /* @__PURE__ */ show(_Show_FixedName);
  var lookupModule2 = /* @__PURE__ */ lookupModule({
    reflectSymbol: function() {
      return "functionDefs";
    }
  })()(_Ord_FixedName);
  var traverse13 = /* @__PURE__ */ traverse(traversableArray);
  var show42 = /* @__PURE__ */ show(showString);
  var fromFoldable7 = /* @__PURE__ */ fromFoldable3(ordString)(foldableArray);
  var map20 = /* @__PURE__ */ map(functorArray);
  var lmap2 = /* @__PURE__ */ lmap(bifunctorTuple);
  var lookupModule1 = /* @__PURE__ */ lookupModule({
    reflectSymbol: function() {
      return "latticeTypeDefs";
    }
  })()(_Ord_FixedName);
  var rmap3 = /* @__PURE__ */ rmap(bifunctorTuple);
  var union3 = /* @__PURE__ */ union2(_Ord_VarName);
  var discard7 = /* @__PURE__ */ discard(discardUnit);
  var eq3 = /* @__PURE__ */ eq(_Eq_FixedName);
  var lookup7 = /* @__PURE__ */ lookup2(_Ord_FixedName);
  var render11 = /* @__PURE__ */ render(_Render_Prop);
  var show52 = /* @__PURE__ */ show(/* @__PURE__ */ _Show_PropF(_Eq_Show));
  var pure9 = /* @__PURE__ */ pure(applicativeArray);
  var show62 = /* @__PURE__ */ show(showBoolean);
  var show72 = /* @__PURE__ */ show(/* @__PURE__ */ _Show_Exc({
    reflectSymbol: function() {
      return "ignore prop";
    }
  }));
  var prop4 = /* @__PURE__ */ prop3({
    reflectSymbol: function() {
      return "prop";
    }
  })()();
  var identity14 = /* @__PURE__ */ identity(categoryFn);
  var insert5 = /* @__PURE__ */ insert(_Ord_FixedName);
  var pure14 = /* @__PURE__ */ pure(applicativeList);
  var lmap1 = /* @__PURE__ */ lmap(bifunctorEither);
  var mapFlipped4 = /* @__PURE__ */ mapFlipped(functorArray);
  var freshenVarNames2 = /* @__PURE__ */ freshenVarNames(_Show_RipeRule)(_Traversable_RipeRuleF);
  var render13 = /* @__PURE__ */ render(_Render_Rule);
  var insertWith2 = /* @__PURE__ */ insertWith(_Ord_FixedName);
  var append14 = /* @__PURE__ */ append(semigroupList);
  var fold5 = /* @__PURE__ */ fold(foldableList);
  var fold14 = /* @__PURE__ */ fold5(monoidList);
  var traverse23 = /* @__PURE__ */ traverse(traversableList);
  var show82 = /* @__PURE__ */ show(/* @__PURE__ */ _Show_Exc({
    reflectSymbol: function() {
      return "apply rule";
    }
  }));
  var render22 = /* @__PURE__ */ render(_Render_TermSubst);
  var show9 = /* @__PURE__ */ show(showInt);
  var lookup13 = /* @__PURE__ */ lookup6(_Ord_FixedName);
  var traceM3 = /* @__PURE__ */ traceM();
  var fold22 = /* @__PURE__ */ fold5(/* @__PURE__ */ monoidSemigroupMap()(_Ord_FixedName)(semigroupList));
  var unionWith2 = /* @__PURE__ */ unionWith(_Ord_FixedName);
  var map110 = /* @__PURE__ */ map(functorList);
  var Log = /* @__PURE__ */ function() {
    function Log2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Log2.create = function(value0) {
      return function(value1) {
        return new Log2(value0, value1);
      };
    };
    return Log2;
  }();
  var throwError_compareTerm = function(dictMonadThrow) {
    var throwError3 = throwError(dictMonadThrow);
    return function(lty) {
      return function(t1) {
        return function(t2) {
          return throwError3({
            label: _compare,
            source: "compareTerm",
            description: "in lattice " + (show8(lty) + (", " + (show13(t1) + (" !<= " + show13(t2)))))
          });
        };
      };
    };
  };
  var tellLog = function(dictMonadState) {
    var bind9 = bind(dictMonadState.Monad0().Bind1());
    var get5 = get(dictMonadState);
    return function(dictMonadWriter) {
      var tell4 = tell(dictMonadWriter.MonadTell1());
      return function(r) {
        return bind9(get5)(function(env) {
          return tell4([new Log(r, new Just(env))]);
        });
      };
    };
  };
  var partitionEither = function(p2) {
    return function(xs) {
      var select5 = function(a2) {
        return function(v) {
          var v1 = p2(a2);
          if (v1 instanceof Left) {
            return new Tuple(new Cons(v1.value0, v.value0), v.value1);
          }
          ;
          if (v1 instanceof Right) {
            return new Tuple(v.value0, new Cons(v1.value0, v.value1));
          }
          ;
          throw new Error("Failed pattern match at Foliage.Interpretation (line 537, column 25 - line 539, column 30): " + [v1.constructor.name]);
        };
      };
      return foldr7(select5)(new Tuple(Nil.value, Nil.value))(xs);
    };
  };
  var evaluateTerm = function(dictMonadThrow) {
    var throwError3 = throwError(dictMonadThrow);
    return traverse7(dictMonadThrow.Monad0().Applicative0())(function(x) {
      return throwError3({
        label: _error,
        source: "evaluateTerm",
        description: "expected term to be a value, but found a variable " + show23(x)
      });
    });
  };
  var processSideHypothesis = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var bind9 = bind(bindExceptT(Monad0));
    var ask3 = ask(monadAskExceptT(MonadAsk0));
    var lift1 = lift6(Monad0);
    var applicativeExceptT2 = applicativeExceptT(Monad0);
    var pure23 = pure(applicativeExceptT2);
    var traverse32 = traverse13(applicativeExceptT2);
    return function(dictMonadThrow) {
      var throwError3 = throwError(dictMonadThrow);
      var evaluateTerm1 = evaluateTerm(dictMonadThrow);
      return function(rule) {
        return function(v) {
          return bind9(ask3)(function(v1) {
            return bind9(maybe(lift1(throwError3({
              label: _error,
              source: "processSideHypothesis",
              description: "could not function definition of the name " + show32(v.value0.functionName)
            })))(pure23)(lookupModule2($$Proxy.value)(v.value0.functionName)(v1.focusModule)))(function(functionDef) {
              return bind9(bind9(traverse32(function($706) {
                return lift1(evaluateTerm1($706));
              })(v.value0.args))(function(args) {
                return bind9(either(function(err) {
                  return lift1(throwError3({
                    label: _error,
                    source: "processSideHypothesis",
                    description: "error in function " + (show42(functionDef.value0.name) + (": " + err))
                  }));
                })(pure23)(fromOpaque(functionDef.value0.impl)(fromFoldable7(map20(lmap2(fst))(zip(functionDef.value0.inputs)(args))))))(function(result) {
                  return pure23(result);
                });
              }))(function(result) {
                return pure23(substRule(singleton6(v.value0.resultVarVarName)(result))(rule));
              });
            });
          });
        };
      };
    };
  };
  var processSideHypotheses = function(dictMonadReader) {
    var Monad0 = dictMonadReader.MonadAsk0().Monad0();
    var bind9 = bind(bindExceptT(Monad0));
    var processSideHypothesis1 = processSideHypothesis(dictMonadReader);
    var pure23 = pure(applicativeExceptT(Monad0));
    return function(dictMonadThrow) {
      var processSideHypothesis2 = processSideHypothesis1(dictMonadThrow);
      return function(rule) {
        return function(sides) {
          return foldr2(function(side) {
            return function(m_rule) {
              return bind9(m_rule)(function(rule$prime) {
                return processSideHypothesis2(rule$prime)(side);
              });
            };
          })(pure23(rule))(sides);
        };
      };
    };
  };
  var compareTerm = function(dictMonadThrow) {
    var throwError3 = throwError(dictMonadThrow);
    return function(dictMonadReader) {
      var MonadAsk0 = dictMonadReader.MonadAsk0();
      var Monad0 = MonadAsk0.Monad0();
      var pure23 = pure(applicativeExceptT(Monad0));
      var bind9 = bind(bindExceptT(Monad0));
      var ask3 = ask(monadAskExceptT(MonadAsk0));
      var monadThrowExceptT2 = monadThrowExceptT(Monad0);
      var throwError12 = throwError(monadThrowExceptT2);
      var lift1 = lift6(Monad0);
      var throwError_compareTerm1 = throwError_compareTerm(monadThrowExceptT2);
      var map29 = map(functorExceptT(Monad0.Bind1().Apply0().Functor0()));
      return function(dictMonadWriter) {
        return function(v) {
          return function(v1) {
            return function(v2) {
              if (v2 instanceof VarTerm) {
                return pure23(new Tuple(EQ.value, singleton6(v2.value0)(v1)));
              }
              ;
              if (v1 instanceof VarTerm) {
                return pure23(new Tuple(EQ.value, singleton6(v1.value0)(v2)));
              }
              ;
              if (v instanceof NamedLatticeType) {
                return bind9(ask3)(function(v32) {
                  var v4 = lookupModule1($$Proxy.value)(v.value0)(v32.focusModule);
                  if (v4 instanceof Nothing) {
                    return throwError12({
                      label: _compare,
                      source: "comapreTerm " + (show8(v) + (" " + (show13(v1) + (" " + show13(v2))))),
                      description: "could not find lattice type definition with name " + show32(v.value0)
                    });
                  }
                  ;
                  if (v4 instanceof Just) {
                    if (v4.value0 instanceof LatticeTypeDef) {
                      return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v4.value0.value0)(v1)(v2);
                    }
                    ;
                    if (v4.value0 instanceof ExternalLatticeTypeDef) {
                      var v5 = runExcept(runExceptT(fromOpaque(v4.value0.value0.compare_impl)(new Tuple(v1, v2))));
                      if (v5 instanceof Left) {
                        return throwError12(v5.value0);
                      }
                      ;
                      if (v5 instanceof Right && v5.value0 instanceof Left) {
                        return lift1(throwError3(map_Exc_label(_error)(v5.value0.value0)));
                      }
                      ;
                      if (v5 instanceof Right && v5.value0 instanceof Right) {
                        return pure23(new Tuple(v5.value0.value0.value0, v5.value0.value0.value1));
                      }
                      ;
                      throw new Error("Failed pattern match at Foliage.Interpretation (line 457, column 9 - line 460, column 58): " + [v5.constructor.name]);
                    }
                    ;
                    throw new Error("Failed pattern match at Foliage.Interpretation (line 452, column 28 - line 460, column 58): " + [v4.value0.constructor.name]);
                  }
                  ;
                  throw new Error("Failed pattern match at Foliage.Interpretation (line 450, column 3 - line 460, column 58): " + [v4.constructor.name]);
                });
              }
              ;
              if (v instanceof UnitLatticeType) {
                var v3 = new Tuple(v1, v2);
                if (v3.value0 instanceof UnitTerm && v3.value1 instanceof UnitTerm) {
                  return pure23(new Tuple(EQ.value, empty3));
                }
                ;
                return lift1(throwError3({
                  label: _error,
                  source: "compareTerm",
                  description: "type error; expected " + (show42(show13(v1)) + (" and " + (show42(show13(v2)) + (" to have the type " + (show42(show8(v)) + ".")))))
                }));
              }
              ;
              if (v instanceof SumLatticeType && v.value0 instanceof LeftGreaterThanRight_SumLatticeTypeOrdering) {
                var v3 = new Tuple(v1, v2);
                if (v3.value0 instanceof LeftTerm && v3.value1 instanceof LeftTerm) {
                  return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value1)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                if (v3.value0 instanceof LeftTerm && v3.value1 instanceof RightTerm) {
                  return pure23(new Tuple(GT.value, empty3));
                }
                ;
                if (v3.value0 instanceof RightTerm && v3.value1 instanceof LeftTerm) {
                  return pure23(new Tuple(LT.value, empty3));
                }
                ;
                if (v3.value0 instanceof RightTerm && v3.value1 instanceof RightTerm) {
                  return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value2)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                return lift1(throwError3({
                  label: _error,
                  source: "compareTerm",
                  description: "type error; expected " + (show42(show13(v1)) + (" and " + (show42(show13(v2)) + (" to have the type " + (show42(show8(v)) + ".")))))
                }));
              }
              ;
              if (v instanceof SumLatticeType && v.value0 instanceof LeftLessThanRight_SumLatticeTypeOrdering) {
                var v3 = new Tuple(v1, v2);
                if (v3.value0 instanceof LeftTerm && v3.value1 instanceof LeftTerm) {
                  return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value1)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                if (v3.value0 instanceof LeftTerm && v3.value1 instanceof RightTerm) {
                  return pure23(new Tuple(LT.value, empty3));
                }
                ;
                if (v3.value0 instanceof RightTerm && v3.value1 instanceof LeftTerm) {
                  return pure23(new Tuple(GT.value, empty3));
                }
                ;
                if (v3.value0 instanceof RightTerm && v3.value1 instanceof RightTerm) {
                  return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value2)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                return lift1(throwError3({
                  label: _error,
                  source: "compareTerm",
                  description: "type error; expected " + (show42(show13(v1)) + (" and " + (show42(show13(v2)) + (" to have the type " + (show42(show8(v)) + ".")))))
                }));
              }
              ;
              if (v instanceof SumLatticeType && v.value0 instanceof LeftIncomparableRight_SumLatticeTypeOrdering) {
                var v3 = new Tuple(v1, v2);
                if (v3.value0 instanceof LeftTerm && v3.value1 instanceof LeftTerm) {
                  return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value1)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                if (v3.value0 instanceof LeftTerm && v3.value1 instanceof RightTerm) {
                  return throwError_compareTerm1(v)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                if (v3.value0 instanceof RightTerm && v3.value1 instanceof LeftTerm) {
                  return throwError_compareTerm1(v)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                if (v3.value0 instanceof RightTerm && v3.value1 instanceof RightTerm) {
                  return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value2)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                return lift1(throwError3({
                  label: _error,
                  source: "compareTerm",
                  description: "type error; expected " + (show42(show13(v1)) + (" and " + (show42(show13(v2)) + (" to have the type " + (show42(show8(v)) + ".")))))
                }));
              }
              ;
              if (v instanceof SumLatticeType && v.value0 instanceof LeftEqualRight_SumLatticeTypeOrdering) {
                var v3 = new Tuple(v1, v2);
                if (v3.value0 instanceof LeftTerm && v3.value1 instanceof LeftTerm) {
                  return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value1)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                if (v3.value0 instanceof LeftTerm && v3.value1 instanceof RightTerm) {
                  return pure23(new Tuple(EQ.value, empty3));
                }
                ;
                if (v3.value0 instanceof RightTerm && v3.value1 instanceof LeftTerm) {
                  return pure23(new Tuple(EQ.value, empty3));
                }
                ;
                if (v3.value0 instanceof RightTerm && v3.value1 instanceof RightTerm) {
                  return compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value2)(v3.value0.value0)(v3.value1.value0);
                }
                ;
                return lift1(throwError3({
                  label: _error,
                  source: "compareTerm",
                  description: "type error; expected " + (show42(show13(v1)) + (" and " + (show42(show13(v2)) + (" to have the type " + (show42(show8(v)) + ".")))))
                }));
              }
              ;
              if (v instanceof ProductLatticeType) {
                var v3 = new Tuple(v1, v2);
                if (v3.value0 instanceof PairTerm && v3.value1 instanceof PairTerm) {
                  return bind9(compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value1)(v3.value0.value0)(v3.value1.value0))(function(v4) {
                    if (v4.value0 instanceof LT) {
                      return pure23(new Tuple(LT.value, v4.value1));
                    }
                    ;
                    if (v4.value0 instanceof EQ) {
                      return bind9(pure23(substTerm(v4.value1)(v3.value0.value1)))(function(t1_21) {
                        return bind9(pure23(substTerm(v4.value1)(v3.value1.value1)))(function(t2_21) {
                          return map29(rmap3(union3(v4.value1)))(compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value2)(t1_21)(t2_21));
                        });
                      });
                    }
                    ;
                    if (v4.value0 instanceof GT) {
                      return pure23(new Tuple(GT.value, v4.value1));
                    }
                    ;
                    throw new Error("Failed pattern match at Foliage.Interpretation (line 497, column 11 - line 503, column 44): " + [v4.constructor.name]);
                  });
                }
                ;
                return lift1(throwError3({
                  label: _error,
                  source: "compareTerm",
                  description: "type error; expected " + (show42(show13(v1)) + (" and " + (show42(show13(v2)) + (" to have the type " + (show42(show8(v)) + ".")))))
                }));
              }
              ;
              if (v instanceof SetLatticeType) {
                return todo("compareTerm SetLatticeType");
              }
              ;
              if (v instanceof OppositeLatticeType) {
                return bind9(compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value0)(v1)(v2))(function(v32) {
                  if (v32.value0 instanceof LT) {
                    return pure23(new Tuple(GT.value, v32.value1));
                  }
                  ;
                  if (v32.value0 instanceof EQ) {
                    return pure23(new Tuple(EQ.value, v32.value1));
                  }
                  ;
                  if (v32.value0 instanceof GT) {
                    return pure23(new Tuple(LT.value, v32.value1));
                  }
                  ;
                  throw new Error("Failed pattern match at Foliage.Interpretation (line 510, column 9 - line 513, column 42): " + [v32.constructor.name]);
                });
              }
              ;
              if (v instanceof DiscreteLatticeType) {
                return bind9(compareTerm(dictMonadThrow)(dictMonadReader)(dictMonadWriter)(v.value0)(v1)(v2))(function(v32) {
                  if (v32.value0 instanceof LT) {
                    return throwError_compareTerm1(new DiscreteLatticeType(v.value0))(v1)(v2);
                  }
                  ;
                  if (v32.value0 instanceof EQ) {
                    return pure23(new Tuple(EQ.value, v32.value1));
                  }
                  ;
                  if (v32.value0 instanceof GT) {
                    return throwError_compareTerm1(new DiscreteLatticeType(v.value0))(v1)(v2);
                  }
                  ;
                  throw new Error("Failed pattern match at Foliage.Interpretation (line 517, column 9 - line 520, column 79): " + [v32.constructor.name]);
                });
              }
              ;
              if (v instanceof PowerLatticeType) {
                return todo("compareTerm PowerLatticeType");
              }
              ;
              throw new Error("Failed pattern match at Foliage.Interpretation (line 430, column 1 - line 435, column 75): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
            };
          };
        };
      };
    };
  };
  var compareProp = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var bindExceptT3 = bindExceptT(Monad0);
    var discard13 = discard7(bindExceptT3);
    var applicativeExceptT2 = applicativeExceptT(Monad0);
    var unless2 = unless(applicativeExceptT2);
    var throwError3 = throwError(monadThrowExceptT(Monad0));
    var bind9 = bind(bindExceptT3);
    var ask3 = ask(monadAskExceptT(MonadAsk0));
    var lift1 = lift6(Monad0);
    var pure23 = pure(applicativeExceptT2);
    return function(dictMonadThrow) {
      var throwError12 = throwError(dictMonadThrow);
      var compareTerm1 = compareTerm(dictMonadThrow)(dictMonadReader);
      return function(dictMonadWriter) {
        var compareTerm2 = compareTerm1(dictMonadWriter);
        return function(v) {
          return function(v1) {
            return discard13(unless2(eq3(v.value0)(v1.value0))(throwError3({
              label: _compare,
              source: "compareProp",
              description: show32(v.value0) + (" != " + show32(v1.value0))
            })))(function() {
              return bind9(ask3)(function(v2) {
                return bind9(function() {
                  var v3 = lookup7(v.value0)(v2.focusModule.value0.relations);
                  if (v3 instanceof Nothing) {
                    return lift1(throwError12({
                      label: _error,
                      source: "compareProp",
                      description: "could not find relation " + show42(show32(v.value0))
                    }));
                  }
                  ;
                  if (v3 instanceof Just) {
                    return pure23(v3.value0.value0.domain);
                  }
                  ;
                  throw new Error("Failed pattern match at Foliage.Interpretation (line 423, column 13 - line 425, column 46): " + [v3.constructor.name]);
                }())(function(domain) {
                  return compareTerm2(domain)(v.value1)(v1.value1);
                });
              });
            });
          };
        };
      };
    };
  };
  var askRenderCtx = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var pure23 = pure(Monad0.Applicative0());
    return bind(Monad0.Bind1())(ask(MonadAsk0))(function(v) {
      return pure23({
        mod: v.focusModule
      });
    });
  };
  var joinProps = function(dictMonad) {
    var foldM2 = foldM(monadExceptT(dictMonad));
    var bindExceptT3 = bindExceptT(dictMonad);
    var bind9 = bind(bindExceptT3);
    var bindFlipped9 = bindFlipped(bindExceptT3);
    var pure23 = pure(applicativeExceptT(dictMonad));
    var discard13 = discard7(bindExceptT3);
    var throwError3 = throwError(monadThrowExceptT(dictMonad));
    var lift1 = lift6(dictMonad);
    return function(dictMonadReader) {
      var askRenderCtx1 = askRenderCtx(monadReaderExceptT(dictMonadReader));
      var compareProp1 = compareProp(dictMonadReader);
      return function(dictMonadThrow) {
        var compareProp2 = compareProp1(dictMonadThrow);
        return function(dictMonadState) {
          var tellLog1 = tellLog(monadStateExceptT(dictMonadState));
          return function(dictMonadWriter) {
            var tellLog2 = tellLog1(monadWriterExceptT(dictMonadWriter));
            var compareProp3 = compareProp2(dictMonadWriter);
            return function(g) {
              return function(props) {
                return function(prop1) {
                  return foldM2(function(known_props) {
                    return function(prop$prime) {
                      return bind9(askRenderCtx1)(function(renderCtx) {
                        return bindFlipped9(function(v) {
                          if (v instanceof Left) {
                            return pure23(new Cons(prop$prime, known_props));
                          }
                          ;
                          if (v instanceof Right && v.value0.value0 instanceof LT) {
                            return discard13(tellLog2({
                              label: "joinProps . props subsume prop",
                              messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(viewOn(prop1)(g))))))]
                            }))(function() {
                              return throwError3({
                                label: $$Proxy.value,
                                source: "joinProps",
                                description: show52(viewOn(prop1)(g)) + (" is subsumed by " + show52(viewOn(prop$prime)(g)))
                              });
                            });
                          }
                          ;
                          if (v instanceof Right && v.value0.value0 instanceof EQ) {
                            return discard13(tellLog2({
                              label: "joinProps . props subsume prop",
                              messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(viewOn(prop1)(g))))))]
                            }))(function() {
                              return throwError3({
                                label: $$Proxy.value,
                                source: "joinProps",
                                description: show52(viewOn(prop1)(g)) + (" is subsumed by " + show52(viewOn(prop$prime)(g)))
                              });
                            });
                          }
                          ;
                          if (v instanceof Right && v.value0.value0 instanceof GT) {
                            return discard13(tellLog2({
                              label: "joinProps . prop subsumes prop'",
                              messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(viewOn(prop1)(g)))))), new Tuple("prop'", div2([])(flip(runReader)(renderCtx)(line(render11(viewOn(prop$prime)(g))))))]
                            }))(function() {
                              return pure23(known_props);
                            });
                          }
                          ;
                          throw new Error("Failed pattern match at Foliage.Interpretation (line 196, column 29 - line 210, column 37): " + [v.constructor.name]);
                        })(lift1(runExceptT(compareProp3(viewOn(prop1)(g))(viewOn(prop$prime)(g)))));
                      });
                    };
                  })(Nil.value)(props);
                };
              };
            };
          };
        };
      };
    };
  };
  var insertProp = function(dictMonad) {
    var bind9 = bind(bindExceptT(dictMonad));
    var joinProps1 = joinProps(dictMonad);
    var pure23 = pure(applicativeExceptT(dictMonad));
    return function(dictMonadReader) {
      var joinProps2 = joinProps1(dictMonadReader);
      return function(dictMonadThrow) {
        var joinProps3 = joinProps2(dictMonadThrow);
        return function(dictMonadState) {
          var joinProps4 = joinProps3(dictMonadState);
          return function(dictMonadWriter) {
            var joinProps5 = joinProps4(dictMonadWriter);
            return function(g) {
              return function(props) {
                return function(prop1) {
                  return runExceptT(bind9(joinProps5(g)(props)(prop1))(function(props$prime) {
                    return pure23(snoc2(props$prime)(prop1));
                  }));
                };
              };
            };
          };
        };
      };
    };
  };
  var deferProp = function(dictMonadState) {
    var tellLog1 = tellLog(dictMonadState);
    var get5 = get(dictMonadState);
    var modify_8 = modify_2(dictMonadState);
    return function(dictMonadWriter) {
      var tellLog2 = tellLog1(dictMonadWriter);
      return function(dictMonadReader) {
        var Monad0 = dictMonadReader.MonadAsk0().Monad0();
        var Bind1 = Monad0.Bind1();
        var bind9 = bind(Bind1);
        var askRenderCtx1 = askRenderCtx(dictMonadReader);
        var discard13 = discard7(Bind1);
        var insertProp1 = insertProp(Monad0)(dictMonadReader);
        var bindFlipped9 = bindFlipped(Bind1);
        var joinProps1 = joinProps(Monad0)(dictMonadReader);
        return function(dictMonadThrow) {
          var insertProp2 = insertProp1(dictMonadThrow)(dictMonadState)(dictMonadWriter);
          var joinProps2 = joinProps1(dictMonadThrow)(dictMonadState)(dictMonadWriter);
          return function(isNew) {
            return function(v) {
              return bind9(askRenderCtx1)(function(renderCtx) {
                return discard13(tellLog2({
                  label: "defer prop",
                  messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(v))))), new Tuple("isNew", div2([])(pure9(text(show62(isNew)))))]
                }))(function() {
                  return bind9(get5)(function(v1) {
                    var success = function(active_props) {
                      return discard13(tellLog2({
                        label: "defer prop . success",
                        messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(v)))))]
                      }))(function() {
                        return modify_8(function(v2) {
                          return {
                            gas: v2.gas,
                            ripe_rules: v2.ripe_rules,
                            known_props: v2.known_props,
                            active_props
                          };
                        });
                      });
                    };
                    var failure = function(exc) {
                      return tellLog2({
                        label: "defer prop . failure",
                        messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(v))))), new Tuple("reason", div2([])(pure9(text(show72(exc)))))]
                      });
                    };
                    return bind9(insertProp2(prop4($$Proxy.value)(strongForget))(v1.active_props)({
                      prop: v,
                      isNew
                    }))(function(v2) {
                      if (v2 instanceof Left) {
                        return failure(v2.value0);
                      }
                      ;
                      if (v2 instanceof Right) {
                        if (isNew) {
                          return maybe(success(v2.value0))(function(known_props) {
                            return bindFlipped9(function(v3) {
                              if (v3 instanceof Left) {
                                return failure(v3.value0);
                              }
                              ;
                              if (v3 instanceof Right) {
                                return success(v2.value0);
                              }
                              ;
                              throw new Error("Failed pattern match at Foliage.Interpretation (line 308, column 35 - line 310, column 56): " + [v3.constructor.name]);
                            })(runExceptT(joinProps2(identity14)(known_props)(v)));
                          })(lookup7(v.value0)(v1.known_props));
                        }
                        ;
                        return success(v2.value0);
                      }
                      ;
                      throw new Error("Failed pattern match at Foliage.Interpretation (line 298, column 9 - line 313, column 33): " + [v2.constructor.name]);
                    });
                  });
                });
              });
            };
          };
        };
      };
    };
  };
  var learnProp = function(dictMonadReader) {
    var Monad0 = dictMonadReader.MonadAsk0().Monad0();
    var Bind1 = Monad0.Bind1();
    var bind9 = bind(Bind1);
    var askRenderCtx1 = askRenderCtx(dictMonadReader);
    var discard13 = discard7(Bind1);
    var bindFlipped9 = bindFlipped(Bind1);
    var insertProp1 = insertProp(Monad0)(dictMonadReader);
    return function(dictMonadState) {
      var get5 = get(dictMonadState);
      var tellLog1 = tellLog(dictMonadState);
      var modify_8 = modify_2(dictMonadState);
      return function(dictMonadThrow) {
        var insertProp2 = insertProp1(dictMonadThrow)(dictMonadState);
        return function(dictMonadWriter) {
          var tellLog2 = tellLog1(dictMonadWriter);
          var insertProp3 = insertProp2(dictMonadWriter);
          return function(v) {
            return bind9(get5)(function(v1) {
              var success = function(known_props$prime) {
                return bind9(askRenderCtx1)(function(renderCtx) {
                  return discard13(tellLog2({
                    label: "learn prop . success",
                    messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(v)))))]
                  }))(function() {
                    return modify_8(function(v2) {
                      return {
                        gas: v2.gas,
                        ripe_rules: v2.ripe_rules,
                        active_props: v2.active_props,
                        known_props: known_props$prime
                      };
                    });
                  });
                });
              };
              var failure = function(exc) {
                return tellLog2({
                  label: "learn prop . failure",
                  messages: [new Tuple("reason", div2([])(pure9(text(show72(exc)))))]
                });
              };
              return function(v2) {
                if (v2 instanceof Nothing) {
                  return success(insert5(v.value0)(pure14(v))(v1.known_props));
                }
                ;
                if (v2 instanceof Just) {
                  return bindFlipped9(function(v3) {
                    if (v3 instanceof Left) {
                      return failure(v3.value0);
                    }
                    ;
                    if (v3 instanceof Right) {
                      return success(insert5(v.value0)(v3.value0)(v1.known_props));
                    }
                    ;
                    throw new Error("Failed pattern match at Foliage.Interpretation (line 176, column 27 - line 178, column 100): " + [v3.constructor.name]);
                  })(insertProp3(identity14)(v2.value0)(v));
                }
                ;
                throw new Error("Failed pattern match at Foliage.Interpretation (line 172, column 7 - line 178, column 100): " + [v2.constructor.name]);
              }(lookup7(v.value0)(v1.known_props));
            });
          };
        };
      };
    };
  };
  var applyRipeRuleToProp = function(dictMonadReader) {
    var Monad0 = dictMonadReader.MonadAsk0().Monad0();
    var bindExceptT3 = bindExceptT(Monad0);
    var bind9 = bind(bindExceptT3);
    var bindFlipped9 = bindFlipped(bindExceptT3);
    var pure23 = pure(applicativeExceptT(Monad0));
    var throwError3 = throwError(monadThrowExceptT(Monad0));
    var map29 = map(Monad0.Bind1().Apply0().Functor0());
    var compareProp1 = compareProp(dictMonadReader);
    var processSideHypotheses1 = processSideHypotheses(dictMonadReader);
    return function(dictMonadThrow) {
      var compareProp2 = compareProp1(dictMonadThrow);
      var processSideHypotheses2 = processSideHypotheses1(dictMonadThrow);
      return function(dictMonadWriter) {
        var compareProp3 = compareProp2(dictMonadWriter);
        return function(dictMonadState) {
          return function(v) {
            return function(prop1) {
              return bind9(bindFlipped9(function(v1) {
                if (v1.value0 instanceof LT) {
                  return pure23(v1.value1);
                }
                ;
                if (v1.value0 instanceof EQ) {
                  return pure23(v1.value1);
                }
                ;
                return throwError3({
                  label: _apply_rule,
                  source: "applyRipeRuleToProp",
                  description: show52(v.value0.hypothesis.value0) + (" < " + show52(prop1))
                });
              })(mapExceptT(map29(lmap1(map_Exc_label(_apply_rule))))(compareProp3(v.value0.hypothesis.value0)(prop1))))(function(sigma) {
                var rule$prime = substRule(sigma)(v["value0"]["rule'"]);
                var hyp_sides$prime = mapFlipped4(v.value0.hypothesis.value1)(substSideHypothesis(sigma));
                return bind9(mapExceptT(map29(lmap1(map_Exc_label(_apply_rule))))(processSideHypotheses2(rule$prime)(hyp_sides$prime)))(function(rule$prime$prime) {
                  return pure23(new Tuple(sigma, rule$prime$prime));
                });
              });
            };
          };
        };
      };
    };
  };
  var deferRipeRule = function(dictMonadReader) {
    var Monad0 = dictMonadReader.MonadAsk0().Monad0();
    var Bind1 = Monad0.Bind1();
    var bind9 = bind(Bind1);
    var Applicative0 = Monad0.Applicative0();
    var pure23 = pure(Applicative0);
    var askRenderCtx1 = askRenderCtx(dictMonadReader);
    var discard13 = discard7(Bind1);
    var filterM2 = filterM(Monad0);
    var map29 = map(Bind1.Apply0().Functor0());
    var applyRipeRuleToProp1 = applyRipeRuleToProp(dictMonadReader);
    var traverse_7 = traverse_(Applicative0)(foldableList);
    return function(dictMonadState) {
      var tellLog1 = tellLog(dictMonadState);
      var modify_8 = modify_2(dictMonadState);
      var get5 = get(dictMonadState);
      var deferProp1 = deferProp(dictMonadState);
      return function(dictMonadThrow) {
        var applyRipeRuleToProp2 = applyRipeRuleToProp1(dictMonadThrow);
        return function(dictMonadWriter) {
          var tellLog2 = tellLog1(dictMonadWriter);
          var applyRipeRuleToProp3 = applyRipeRuleToProp2(dictMonadWriter)(dictMonadState);
          var deferProp2 = deferProp1(dictMonadWriter)(dictMonadReader)(dictMonadThrow);
          return function(ripe_rule_) {
            return bind9(pure23(freshenVarNames2(ripe_rule_)))(function(v) {
              return bind9(askRenderCtx1)(function(renderCtx) {
                return discard13(tellLog2({
                  label: "defer rule",
                  messages: [new Tuple("ripe_rule", div2([])(flip(runReader)(renderCtx)(line(render13(from_RipeRule_to_Rule(v))))))]
                }))(function() {
                  return discard13(modify_8(function(v1) {
                    return {
                      gas: v1.gas,
                      known_props: v1.known_props,
                      active_props: v1.active_props,
                      ripe_rules: insertWith2(append14)(v.value0.hypothesis.value0.value0)(singleton3(v))(v1.ripe_rules)
                    };
                  }))(function() {
                    return bind9(get5)(function(v1) {
                      return bind9(maybe(pure23(Nil.value))(filterM2(function(prop1) {
                        return map29(either($$const(false))($$const(true)))(runExceptT(applyRipeRuleToProp3(v)(prop1)));
                      }))(lookup7(v.value0.hypothesis.value0.value0)(v1.known_props)))(function(props) {
                        return traverse_7(deferProp2(false))(props);
                      });
                    });
                  });
                });
              });
            });
          };
        };
      };
    };
  };
  var resolveProp = function(dictMonadReader) {
    var Monad0 = dictMonadReader.MonadAsk0().Monad0();
    var Bind1 = Monad0.Bind1();
    var bind9 = bind(Bind1);
    var askRenderCtx1 = askRenderCtx(dictMonadReader);
    var discard13 = discard7(Bind1);
    var map29 = map(Bind1.Apply0().Functor0());
    var Applicative0 = Monad0.Applicative0();
    var traverse32 = traverse23(Applicative0);
    var applyRipeRuleToProp1 = applyRipeRuleToProp(dictMonadReader);
    var pure23 = pure(Applicative0);
    var traverse_7 = traverse_(Applicative0)(foldableList);
    var deferRipeRule1 = deferRipeRule(dictMonadReader);
    return function(dictMonadState) {
      var tellLog1 = tellLog(dictMonadState);
      var get5 = get(dictMonadState);
      var deferProp1 = deferProp(dictMonadState);
      var deferRipeRule2 = deferRipeRule1(dictMonadState);
      return function(dictMonadThrow) {
        var applyRipeRuleToProp2 = applyRipeRuleToProp1(dictMonadThrow);
        var deferRipeRule3 = deferRipeRule2(dictMonadThrow);
        return function(dictMonadWriter) {
          var tellLog2 = tellLog1(dictMonadWriter);
          var applyRipeRuleToProp3 = applyRipeRuleToProp2(dictMonadWriter)(dictMonadState);
          var deferProp2 = deferProp1(dictMonadWriter)(dictMonadReader)(dictMonadThrow);
          var deferRipeRule4 = deferRipeRule3(dictMonadWriter);
          return function(v) {
            return bind9(askRenderCtx1)(function(renderCtx) {
              return discard13(tellLog2({
                label: "resolve prop",
                messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(v)))))]
              }))(function() {
                return bind9(get5)(function(v1) {
                  return bind9(map29(fold14)(traverse32(function(ripe_rule) {
                    return bind9(runExceptT(applyRipeRuleToProp3(ripe_rule)(v)))(function(v2) {
                      if (v2 instanceof Left) {
                        return discard13(tellLog2({
                          label: "resolve prop . apply rule . failure",
                          messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(v))))), new Tuple("ripe_rule", div2([])(flip(runReader)(renderCtx)(line(render13(from_RipeRule_to_Rule(ripe_rule)))))), new Tuple("reason", div2([])(pure9(text(show82(v2.value0)))))]
                        }))(function() {
                          return pure23(Nil.value);
                        });
                      }
                      ;
                      if (v2 instanceof Right) {
                        return discard13(tellLog2({
                          label: "resolve prop . apply rule . success",
                          messages: [new Tuple("prop", div2([])(flip(runReader)(renderCtx)(line(render11(v))))), new Tuple("ripe_rule", div2([])(flip(runReader)(renderCtx)(line(render13(from_RipeRule_to_Rule(ripe_rule)))))), new Tuple("sigma", div2([])(flip(runReader)(renderCtx)(line(render22(v2.value0.value0))))), new Tuple("sigma rule", div2([])(flip(runReader)(renderCtx)(line(render13(v2.value0.value1)))))]
                        }))(function() {
                          var v3 = nextHypothesis(v2.value0.value1);
                          if (v3 instanceof Left) {
                            return discard13(deferProp2(true)(v3.value0))(function() {
                              return pure23(Nil.value);
                            });
                          }
                          ;
                          if (v3 instanceof Right) {
                            return pure23(singleton3(v3.value0));
                          }
                          ;
                          throw new Error("Failed pattern match at Foliage.Interpretation (line 267, column 23 - line 273, column 59): " + [v3.constructor.name]);
                        });
                      }
                      ;
                      throw new Error("Failed pattern match at Foliage.Interpretation (line 246, column 21 - line 273, column 59): " + [v2.constructor.name]);
                    });
                  })(fromMaybe(Nil.value)(lookup7(v.value0)(v1.ripe_rules)))))(function(v2) {
                    return traverse_7(deferRipeRule4)(v2);
                  });
                });
              });
            });
          };
        };
      };
    };
  };
  var fixpointFocusModule = function(dictMonadReader) {
    var MonadAsk0 = dictMonadReader.MonadAsk0();
    var Monad0 = MonadAsk0.Monad0();
    var Bind1 = Monad0.Bind1();
    var bind9 = bind(Bind1);
    var ask3 = ask(MonadAsk0);
    var discard13 = discard7(Bind1);
    var Applicative0 = Monad0.Applicative0();
    var when4 = when(Applicative0);
    var pure23 = pure(Applicative0);
    var learnProp1 = learnProp(dictMonadReader);
    var resolveProp1 = resolveProp(dictMonadReader);
    return function(dictMonadState) {
      var modify5 = modify2(dictMonadState);
      var tellLog1 = tellLog(dictMonadState);
      var modify_8 = modify_2(dictMonadState);
      var learnProp2 = learnProp1(dictMonadState);
      var resolveProp2 = resolveProp1(dictMonadState);
      return function(dictMonadThrow) {
        var throwError3 = throwError(dictMonadThrow);
        var learnProp3 = learnProp2(dictMonadThrow);
        var resolveProp3 = resolveProp2(dictMonadThrow);
        return function(dictMonadWriter) {
          var tellLog2 = tellLog1(dictMonadWriter);
          var learnProp4 = learnProp3(dictMonadWriter);
          var resolveProp4 = resolveProp3(dictMonadWriter);
          return bind9(modify5(function(v) {
            return {
              ripe_rules: v.ripe_rules,
              known_props: v.known_props,
              active_props: v.active_props,
              gas: v.gas - 1 | 0
            };
          }))(function(v) {
            return bind9(ask3)(function(v1) {
              return discard13(tellLog2({
                label: "gas = " + show9(v.gas),
                messages: []
              }))(function() {
                return discard13(when4(v.gas <= 0)(discard13(tellLog2({
                  label: "error",
                  messages: [new Tuple("reason", div2([])(pure9(text("out of gas")))), new Tuple("initialGas", div2([])(pure9(text(show9(v1.focusModule.value0.initialGas)))))]
                }))(function() {
                  return throwError3({
                    label: _error,
                    source: "fixpointFocusModule",
                    description: "ran out of gas"
                  });
                })))(function() {
                  if (v.active_props instanceof Nil) {
                    return discard13(tellLog2({
                      label: "done",
                      messages: [new Tuple("gas", div2([])(pure9(text(show9(v.gas)))))]
                    }))(function() {
                      return pure23(unit);
                    });
                  }
                  ;
                  if (v.active_props instanceof Cons) {
                    return discard13(modify_8(function(v2) {
                      return {
                        gas: v2.gas,
                        ripe_rules: v2.ripe_rules,
                        known_props: v2.known_props,
                        active_props: v.active_props.value1
                      };
                    }))(function() {
                      return discard13(when4(v.active_props.value0.isNew)(learnProp4(v.active_props.value0.prop)))(function() {
                        return discard13(resolveProp4(v.active_props.value0.prop))(function() {
                          return fixpointFocusModule(dictMonadReader)(dictMonadState)(dictMonadThrow)(dictMonadWriter);
                        });
                      });
                    });
                  }
                  ;
                  throw new Error("Failed pattern match at Foliage.Interpretation (line 138, column 3 - line 147, column 26): " + [v.active_props.constructor.name]);
                });
              });
            });
          });
        };
      };
    };
  };
  var interpProgram = function(dictMonad) {
    var Bind1 = dictMonad.Bind1();
    var bind9 = bind(Bind1);
    var discard13 = discard7(Bind1);
    var traceM1 = traceM3(dictMonad);
    var monadStateT2 = monadStateT(dictMonad);
    var fixpointFocusModule1 = fixpointFocusModule(monadReaderExceptT(monadReaderReaderT(monadStateT2)))(monadStateExceptT(monadStateReaderT(monadStateStateT(dictMonad))))(monadThrowExceptT(monadReaderT(monadStateT2)));
    var pure23 = pure(dictMonad.Applicative0());
    return function(dictMonadWriter) {
      var fixpointFocusModule2 = fixpointFocusModule1(monadWriterExceptT(monadWriterReaderT(monadWriterStateT(dictMonadWriter))));
      return function(dictMonadThrow) {
        var lookup24 = lookup13(dictMonadThrow)(_Show_FixedName);
        return function(v) {
          return bind9(lookup24("module Main")(mainModuleName)(v.value0.modules))(function(v1) {
            return discard13(traceM1("[interpProgram]"))(function() {
              var env = function() {
                var v2 = lmap2(fold22)(partitionEither(function(rule) {
                  return function(v3) {
                    if (v3 instanceof Left) {
                      return new Right({
                        prop: v3.value0,
                        isNew: false
                      });
                    }
                    ;
                    if (v3 instanceof Right) {
                      return new Left(singleton6(v3.value0.value0.hypothesis.value0.value0)(singleton3(new RipeRule({
                        hypothesis: v3.value0.value0.hypothesis,
                        "rule'": v3["value0"]["value0"]["rule'"]
                      }))));
                    }
                    ;
                    throw new Error("Failed pattern match at Foliage.Interpretation (line 102, column 25 - line 104, column 195): " + [v3.constructor.name]);
                  }(nextHypothesis(rule));
                })(values(v1.value0.rules)));
                return {
                  gas: v1.value0.initialGas,
                  ripe_rules: v2.value0,
                  known_props: foldr7(unionWith2(append14))(empty3)(map110(function(v3) {
                    return singleton6(v3.prop.value0)(singleton3(v3.prop));
                  })(v2.value1)),
                  active_props: v2.value1
                };
              }();
              var ctx = {
                modules: v.value0.modules,
                focusModule: v1
              };
              return bind9(flip(runStateT)(env)(flip(runReaderT)(ctx)(runExceptT(fixpointFocusModule2))))(function(v2) {
                return pure23(new Tuple(either(Just.create)($$const(Nothing.value))(v2.value0), v2.value1));
              });
            });
          });
        };
      };
    };
  };

  // output/Web.HTML.HTMLElement/foreign.js
  function _read(nothing, just, value12) {
    var tag = Object.prototype.toString.call(value12);
    if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
      return just(value12);
    } else {
      return nothing;
    }
  }

  // output/Web.HTML.HTMLElement/index.js
  var toNode2 = unsafeCoerce2;
  var fromElement = function(x) {
    return _read(Nothing.value, Just.create, x);
  };

  // output/Halogen.Query/index.js
  var $$void5 = /* @__PURE__ */ $$void(functorHalogenM);
  var query2 = /* @__PURE__ */ query();
  var identity15 = /* @__PURE__ */ identity(categoryFn);
  var tell2 = function() {
    return function(dictIsSymbol) {
      var query1 = query2(dictIsSymbol);
      return function(dictOrd) {
        var query22 = query1(dictOrd);
        return function(slot4) {
          return function(label5) {
            return function(req2) {
              return $$void5(query22(slot4)(label5)(req2(unit)));
            };
          };
        };
      };
    };
  };
  var request = function() {
    return function(dictIsSymbol) {
      var query1 = query2(dictIsSymbol);
      return function(dictOrd) {
        var query22 = query1(dictOrd);
        return function(slot4) {
          return function(label5) {
            return function(req2) {
              return query22(slot4)(label5)(req2(identity15));
            };
          };
        };
      };
    };
  };

  // output/Foliage.App.Component/index.js
  var append9 = /* @__PURE__ */ append(semigroupArray);
  var slot2 = /* @__PURE__ */ slot();
  var editorIsSymbol = {
    reflectSymbol: function() {
      return "editor";
    }
  };
  var slot1 = /* @__PURE__ */ slot2(editorIsSymbol)(ordUnit);
  var viewerIsSymbol = {
    reflectSymbol: function() {
      return "viewer";
    }
  };
  var slot22 = /* @__PURE__ */ slot2(viewerIsSymbol)(ordUnit);
  var consoleIsSymbol = {
    reflectSymbol: function() {
      return "console";
    }
  };
  var slot3 = /* @__PURE__ */ slot2(consoleIsSymbol)(ordUnit);
  var discard8 = /* @__PURE__ */ discard(discardUnit);
  var discard1 = /* @__PURE__ */ discard8(bindHalogenM);
  var modify_7 = /* @__PURE__ */ modify_2(monadStateHalogenM);
  var tell3 = /* @__PURE__ */ tell2();
  var tell1 = /* @__PURE__ */ tell3(viewerIsSymbol)(ordUnit);
  var tell22 = /* @__PURE__ */ tell3(consoleIsSymbol)(ordUnit);
  var pure10 = /* @__PURE__ */ pure(applicativeHalogenM);
  var bind6 = /* @__PURE__ */ bind(bindHalogenM);
  var mapFlipped5 = /* @__PURE__ */ mapFlipped(functorHalogenM);
  var request2 = /* @__PURE__ */ request()(editorIsSymbol)(ordUnit);
  var log5 = /* @__PURE__ */ log2(/* @__PURE__ */ monadEffectHalogenM(monadEffectAff));
  var bindExceptT2 = /* @__PURE__ */ bindExceptT(monadHalogenM);
  var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindExceptT2);
  var discard23 = /* @__PURE__ */ discard8(bindExceptT2);
  var lift7 = /* @__PURE__ */ lift(monadTransExceptT)(monadHalogenM);
  var pure15 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadHalogenM));
  var monadExceptT3 = /* @__PURE__ */ monadExceptT(monadHalogenM);
  var interpProgram2 = /* @__PURE__ */ interpProgram(/* @__PURE__ */ monadWriterT(monoidArray)(monadExceptT3))(/* @__PURE__ */ monadWriterWriterT(monoidArray)(monadExceptT3))(/* @__PURE__ */ monadThrowWriterT(monoidArray)(/* @__PURE__ */ monadThrowExceptT(monadHalogenM)));
  var traceM4 = /* @__PURE__ */ traceM()(monadHalogenM);
  var show10 = /* @__PURE__ */ show(/* @__PURE__ */ _Show_Exc({
    reflectSymbol: function() {
      return "error";
    }
  }));
  var EditorOutput = /* @__PURE__ */ function() {
    function EditorOutput2(value0) {
      this.value0 = value0;
    }
    ;
    EditorOutput2.create = function(value0) {
      return new EditorOutput2(value0);
    };
    return EditorOutput2;
  }();
  var ViewerOutput = /* @__PURE__ */ function() {
    function ViewerOutput2(value0) {
      this.value0 = value0;
    }
    ;
    ViewerOutput2.create = function(value0) {
      return new ViewerOutput2(value0);
    };
    return ViewerOutput2;
  }();
  var ConsoleOutput = /* @__PURE__ */ function() {
    function ConsoleOutput2(value0) {
      this.value0 = value0;
    }
    ;
    ConsoleOutput2.create = function(value0) {
      return new ConsoleOutput2(value0);
    };
    return ConsoleOutput2;
  }();
  var default_program = nat;
  var _viewer = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _editor = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var _console = /* @__PURE__ */ function() {
    return $$Proxy.value;
  }();
  var component4 = /* @__PURE__ */ function() {
    var render14 = function(state3) {
      return div2([style2(["width: 100%", "background-color: rgba(10, 43, 54, 0.0)"])])([div2([style2(append9(padding_big)(append9(flex_column)(["align-items: center"])))])([div2([style2(append9(["height: 2em"])(append9(["vertical-align: center", "text-align: center"])(append9(font_fancy)(underline))))])([text("Foliage")]), div2([style2(append9(["width: calc(100vw - 2em)", "height: calc(100vh - 5em)"])(append9(flex_row)(["gap: 0"])))])([div2([style2(append9(["height: 100%", "width: 50%", "overflow: scroll"])(flex_column))])([div2([style2(padding_small)])([slot1(_editor)(unit)(component2)({
        program: new Just(force(default_program))
      })(EditorOutput.create)])]), div2([style2(append9(["height: 100%", "width: 50%", "overflow: scroll"])(flex_column))])([div2([style2(padding_small)])([slot22(_viewer)(unit)(component3)({
        program: state3.program
      })(ViewerOutput.create)])]), div2([style2(append9(["height: 100%", "width: 50%", "overflow: scroll"])(flex_column))])([div2([style2(padding_small)])([slot3(_console)(unit)(component)({})(ConsoleOutput.create)])])])])]);
    };
    var initialState = function(input3) {
      return {
        program: force(default_program)
      };
    };
    var handleAction = function(v) {
      if (v instanceof EditorOutput) {
        return discard1(modify_7(function(v1) {
          var $57 = {};
          for (var $58 in v1) {
            if ({}.hasOwnProperty.call(v1, $58)) {
              $57[$58] = v1[$58];
            }
            ;
          }
          ;
          $57.program = v.value0.value0;
          return $57;
        }))(function() {
          return discard1(tell1(_viewer)(unit)(SetResult.create(Nothing.value)))(function() {
            return discard1(tell22(_console)(unit)(SetLogs.create([])))(function() {
              return pure10(unit);
            });
          });
        });
      }
      ;
      if (v instanceof ViewerOutput) {
        return bind6(mapFlipped5(request2(_editor)(unit)(GetProgram.create))(fromJust5("editor must exist")))(function(prog) {
          return discard1(tell1(_viewer)(unit)(SetResult.create(new Just(PendingResult.value))))(function() {
            return discard1(log5("[App.run]"))(function() {
              return discard1(bind6(runExceptT(composeKleisli2(runWriterT)(function(v1) {
                return discard23(lift7(tell22(_console)(unit)(SetLogs.create(v1.value1))))(function() {
                  return pure15(v1.value0);
                });
              })(interpProgram2(prog))))(function(v1) {
                if (v1 instanceof Left) {
                  return discard1(traceM4(show10(v1.value0)))(function() {
                    return tell1(_viewer)(unit)(SetResult.create(new Just(new ErrResult({
                      err: v1.value0,
                      env: Nothing.value
                    }))));
                  });
                }
                ;
                if (v1 instanceof Right) {
                  if (v1.value0.value0 instanceof Nothing) {
                    return tell1(_viewer)(unit)(SetResult.create(new Just(new OkResult({
                      env: v1.value0.value1
                    }))));
                  }
                  ;
                  if (v1.value0.value0 instanceof Just) {
                    return tell1(_viewer)(unit)(SetResult.create(new Just(new ErrResult({
                      err: v1.value0.value0.value0,
                      env: new Just(v1.value0.value1)
                    }))));
                  }
                  ;
                  throw new Error("Failed pattern match at Foliage.App.Component (line 71, column 17 - line 73, column 138): " + [v1.value0.value0.constructor.name]);
                }
                ;
                throw new Error("Failed pattern match at Foliage.App.Component (line 66, column 15 - line 73, column 138): " + [v1.constructor.name]);
              }))(function() {
                return pure10(unit);
              });
            });
          });
        });
      }
      ;
      if (v instanceof ConsoleOutput) {
        if (v.value0 instanceof ShowIntermediateEnv) {
          return discard1(tell1(_viewer)(unit)(SetIntermediateEnv.create(new Just(v.value0.value0))))(function() {
            return pure10(unit);
          });
        }
        ;
        if (v.value0 instanceof HideIntermediateEnv) {
          return discard1(tell1(_viewer)(unit)(SetIntermediateEnv.create(Nothing.value)))(function() {
            return pure10(unit);
          });
        }
        ;
        throw new Error("Failed pattern match at Foliage.App.Component (line 75, column 29 - line 81, column 18): " + [v.value0.constructor.name]);
      }
      ;
      throw new Error("Failed pattern match at Foliage.App.Component (line 45, column 18 - line 81, column 18): " + [v.constructor.name]);
    };
    var $$eval = mkEval({
      handleQuery: defaultEval.handleQuery,
      receive: defaultEval.receive,
      initialize: defaultEval.initialize,
      finalize: defaultEval.finalize,
      handleAction
    });
    return mkComponent({
      initialState,
      "eval": $$eval,
      render: render14
    });
  }();

  // output/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output/Web.HTML.HTMLDocument/foreign.js
  function _readyState(doc) {
    return doc.readyState;
  }

  // output/Web.HTML.HTMLDocument.ReadyState/index.js
  var Loading = /* @__PURE__ */ function() {
    function Loading2() {
    }
    ;
    Loading2.value = new Loading2();
    return Loading2;
  }();
  var Interactive = /* @__PURE__ */ function() {
    function Interactive2() {
    }
    ;
    Interactive2.value = new Interactive2();
    return Interactive2;
  }();
  var Complete = /* @__PURE__ */ function() {
    function Complete2() {
    }
    ;
    Complete2.value = new Complete2();
    return Complete2;
  }();
  var parse = function(v) {
    if (v === "loading") {
      return new Just(Loading.value);
    }
    ;
    if (v === "interactive") {
      return new Just(Interactive.value);
    }
    ;
    if (v === "complete") {
      return new Just(Complete.value);
    }
    ;
    return Nothing.value;
  };

  // output/Web.HTML.HTMLDocument/index.js
  var map21 = /* @__PURE__ */ map(functorEffect);
  var toParentNode = unsafeCoerce2;
  var toDocument = unsafeCoerce2;
  var readyState = function(doc) {
    return map21(function() {
      var $4 = fromMaybe(Loading.value);
      return function($5) {
        return $4(parse($5));
      };
    }())(function() {
      return _readyState(doc);
    });
  };

  // output/Web.HTML.Window/foreign.js
  function document(window2) {
    return function() {
      return window2.document;
    };
  }

  // output/Web.HTML.Window/index.js
  var toEventTarget = unsafeCoerce2;

  // output/Halogen.Aff.Util/index.js
  var bind7 = /* @__PURE__ */ bind(bindAff);
  var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var bindFlipped4 = /* @__PURE__ */ bindFlipped(bindEffect);
  var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindEffect);
  var pure11 = /* @__PURE__ */ pure(applicativeAff);
  var bindFlipped1 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var pure16 = /* @__PURE__ */ pure(applicativeEffect);
  var map23 = /* @__PURE__ */ map(functorEffect);
  var discard9 = /* @__PURE__ */ discard(discardUnit);
  var throwError2 = /* @__PURE__ */ throwError(monadThrowAff);
  var selectElement = function(query3) {
    return bind7(liftEffect3(bindFlipped4(composeKleisliFlipped2(function() {
      var $16 = querySelector(query3);
      return function($17) {
        return $16(toParentNode($17));
      };
    }())(document))(windowImpl)))(function(mel) {
      return pure11(bindFlipped1(fromElement)(mel));
    });
  };
  var runHalogenAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure16(unit))));
  var awaitLoad = /* @__PURE__ */ makeAff(function(callback) {
    return function __do2() {
      var rs = bindFlipped4(readyState)(bindFlipped4(document)(windowImpl))();
      if (rs instanceof Loading) {
        var et = map23(toEventTarget)(windowImpl)();
        var listener = eventListener(function(v) {
          return callback(new Right(unit));
        })();
        addEventListener2(domcontentloaded)(listener)(false)(et)();
        return effectCanceler(removeEventListener2(domcontentloaded)(listener)(false)(et));
      }
      ;
      callback(new Right(unit))();
      return nonCanceler;
    };
  });
  var awaitBody = /* @__PURE__ */ discard9(bindAff)(awaitLoad)(function() {
    return bind7(selectElement("body"))(function(body2) {
      return maybe(throwError2(error("Could not find body")))(pure11)(body2);
    });
  });

  // output/Control.Monad.Fork.Class/index.js
  var monadForkAff = {
    suspend: suspendAff,
    fork: forkAff,
    join: joinFiber,
    Monad0: function() {
      return monadAff;
    },
    Functor1: function() {
      return functorFiber;
    }
  };
  var fork2 = function(dict) {
    return dict.fork;
  };

  // output/Halogen.Aff.Driver.State/index.js
  var unRenderStateX = unsafeCoerce2;
  var unDriverStateX = unsafeCoerce2;
  var renderStateX_ = function(dictApplicative) {
    var traverse_7 = traverse_(dictApplicative)(foldableMaybe);
    return function(f) {
      return unDriverStateX(function(st) {
        return traverse_7(f)(st.rendering);
      });
    };
  };
  var mkRenderStateX = unsafeCoerce2;
  var renderStateX = function(dictFunctor) {
    return function(f) {
      return unDriverStateX(function(st) {
        return mkRenderStateX(f(st.rendering));
      });
    };
  };
  var mkDriverStateXRef = unsafeCoerce2;
  var mapDriverState = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var initDriverState = function(component5) {
    return function(input3) {
      return function(handler3) {
        return function(lchs) {
          return function __do2() {
            var selfRef = $$new({})();
            var childrenIn = $$new(empty4)();
            var childrenOut = $$new(empty4)();
            var handlerRef = $$new(handler3)();
            var pendingQueries = $$new(new Just(Nil.value))();
            var pendingOuts = $$new(new Just(Nil.value))();
            var pendingHandlers = $$new(Nothing.value)();
            var fresh2 = $$new(1)();
            var subscriptions = $$new(new Just(empty3))();
            var forks = $$new(empty3)();
            var ds = {
              component: component5,
              state: component5.initialState(input3),
              refs: empty3,
              children: empty4,
              childrenIn,
              childrenOut,
              selfRef,
              handlerRef,
              pendingQueries,
              pendingOuts,
              pendingHandlers,
              rendering: Nothing.value,
              fresh: fresh2,
              subscriptions,
              forks,
              lifecycleHandlers: lchs
            };
            write(ds)(selfRef)();
            return mkDriverStateXRef(selfRef);
          };
        };
      };
    };
  };

  // output/Halogen.Aff.Driver.Eval/index.js
  var traverse_4 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var bindFlipped5 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var lookup8 = /* @__PURE__ */ lookup2(ordSubscriptionId);
  var bind12 = /* @__PURE__ */ bind(bindAff);
  var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var discard10 = /* @__PURE__ */ discard(discardUnit);
  var discard12 = /* @__PURE__ */ discard10(bindAff);
  var traverse_12 = /* @__PURE__ */ traverse_(applicativeAff);
  var traverse_22 = /* @__PURE__ */ traverse_12(foldableList);
  var fork3 = /* @__PURE__ */ fork2(monadForkAff);
  var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(applicativeParAff)(foldableList);
  var pure17 = /* @__PURE__ */ pure(applicativeAff);
  var map24 = /* @__PURE__ */ map(functorCoyoneda);
  var parallel3 = /* @__PURE__ */ parallel(parallelAff);
  var map111 = /* @__PURE__ */ map(functorAff);
  var sequential2 = /* @__PURE__ */ sequential(parallelAff);
  var map25 = /* @__PURE__ */ map(functorMaybe);
  var insert6 = /* @__PURE__ */ insert(ordSubscriptionId);
  var retractFreeAp2 = /* @__PURE__ */ retractFreeAp(applicativeParAff);
  var $$delete2 = /* @__PURE__ */ $$delete(ordForkId);
  var unlessM2 = /* @__PURE__ */ unlessM(monadEffect);
  var insert12 = /* @__PURE__ */ insert(ordForkId);
  var traverse_32 = /* @__PURE__ */ traverse_12(foldableMaybe);
  var lookup14 = /* @__PURE__ */ lookup2(ordForkId);
  var lookup23 = /* @__PURE__ */ lookup2(ordString);
  var foldFree2 = /* @__PURE__ */ foldFree(monadRecAff);
  var alter2 = /* @__PURE__ */ alter(ordString);
  var unsubscribe3 = function(sid) {
    return function(ref2) {
      return function __do2() {
        var v = read(ref2)();
        var subs = read(v.subscriptions)();
        return traverse_4(unsubscribe)(bindFlipped5(lookup8(sid))(subs))();
      };
    };
  };
  var queueOrRun = function(ref2) {
    return function(au) {
      return bind12(liftEffect4(read(ref2)))(function(v) {
        if (v instanceof Nothing) {
          return au;
        }
        ;
        if (v instanceof Just) {
          return liftEffect4(write(new Just(new Cons(au, v.value0)))(ref2));
        }
        ;
        throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 188, column 33 - line 190, column 57): " + [v.constructor.name]);
      });
    };
  };
  var handleLifecycle = function(lchs) {
    return function(f) {
      return discard12(liftEffect4(write({
        initializers: Nil.value,
        finalizers: Nil.value
      })(lchs)))(function() {
        return bind12(liftEffect4(f))(function(result) {
          return bind12(liftEffect4(read(lchs)))(function(v) {
            return discard12(traverse_22(fork3)(v.finalizers))(function() {
              return discard12(parSequence_2(v.initializers))(function() {
                return pure17(result);
              });
            });
          });
        });
      });
    };
  };
  var handleAff = /* @__PURE__ */ runAff_(/* @__PURE__ */ either(throwException)(/* @__PURE__ */ $$const(/* @__PURE__ */ pure(applicativeEffect)(unit))));
  var fresh = function(f) {
    return function(ref2) {
      return bind12(liftEffect4(read(ref2)))(function(v) {
        return liftEffect4(modify$prime(function(i2) {
          return {
            state: i2 + 1 | 0,
            value: f(i2)
          };
        })(v.fresh));
      });
    };
  };
  var evalQ = function(render14) {
    return function(ref2) {
      return function(q2) {
        return bind12(liftEffect4(read(ref2)))(function(v) {
          return evalM(render14)(ref2)(v["component"]["eval"](new Query(map24(Just.create)(liftCoyoneda(q2)), $$const(Nothing.value))));
        });
      };
    };
  };
  var evalM = function(render14) {
    return function(initRef) {
      return function(v) {
        var evalChildQuery = function(ref2) {
          return function(cqb) {
            return bind12(liftEffect4(read(ref2)))(function(v1) {
              return unChildQueryBox(function(v2) {
                var evalChild = function(v3) {
                  return parallel3(bind12(liftEffect4(read(v3)))(function(dsx) {
                    return unDriverStateX(function(ds) {
                      return evalQ(render14)(ds.selfRef)(v2.value1);
                    })(dsx);
                  }));
                };
                return map111(v2.value2)(sequential2(v2.value0(applicativeParAff)(evalChild)(v1.children)));
              })(cqb);
            });
          };
        };
        var go2 = function(ref2) {
          return function(v1) {
            if (v1 instanceof State) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                var v3 = v1.value0(v2.state);
                if (unsafeRefEq(v2.state)(v3.value1)) {
                  return pure17(v3.value0);
                }
                ;
                if (otherwise) {
                  return discard12(liftEffect4(write({
                    component: v2.component,
                    refs: v2.refs,
                    children: v2.children,
                    childrenIn: v2.childrenIn,
                    childrenOut: v2.childrenOut,
                    selfRef: v2.selfRef,
                    handlerRef: v2.handlerRef,
                    pendingQueries: v2.pendingQueries,
                    pendingOuts: v2.pendingOuts,
                    pendingHandlers: v2.pendingHandlers,
                    rendering: v2.rendering,
                    fresh: v2.fresh,
                    subscriptions: v2.subscriptions,
                    forks: v2.forks,
                    lifecycleHandlers: v2.lifecycleHandlers,
                    state: v3.value1
                  })(ref2)))(function() {
                    return discard12(handleLifecycle(v2.lifecycleHandlers)(render14(v2.lifecycleHandlers)(ref2)))(function() {
                      return pure17(v3.value0);
                    });
                  });
                }
                ;
                throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 86, column 7 - line 92, column 21): " + [v3.constructor.name]);
              });
            }
            ;
            if (v1 instanceof Subscribe) {
              return bind12(fresh(SubscriptionId)(ref2))(function(sid) {
                return bind12(liftEffect4(subscribe(v1.value0(sid))(function(act) {
                  return handleAff(evalF(render14)(ref2)(new Action(act)));
                })))(function(finalize) {
                  return bind12(liftEffect4(read(ref2)))(function(v2) {
                    return discard12(liftEffect4(modify_(map25(insert6(sid)(finalize)))(v2.subscriptions)))(function() {
                      return pure17(v1.value1(sid));
                    });
                  });
                });
              });
            }
            ;
            if (v1 instanceof Unsubscribe) {
              return discard12(liftEffect4(unsubscribe3(v1.value0)(ref2)))(function() {
                return pure17(v1.value1);
              });
            }
            ;
            if (v1 instanceof Lift2) {
              return v1.value0;
            }
            ;
            if (v1 instanceof ChildQuery2) {
              return evalChildQuery(ref2)(v1.value0);
            }
            ;
            if (v1 instanceof Raise) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                return bind12(liftEffect4(read(v2.handlerRef)))(function(handler3) {
                  return discard12(queueOrRun(v2.pendingOuts)(handler3(v1.value0)))(function() {
                    return pure17(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof Par) {
              return sequential2(retractFreeAp2(hoistFreeAp(function() {
                var $119 = evalM(render14)(ref2);
                return function($120) {
                  return parallel3($119($120));
                };
              }())(v1.value0)));
            }
            ;
            if (v1 instanceof Fork) {
              return bind12(fresh(ForkId)(ref2))(function(fid) {
                return bind12(liftEffect4(read(ref2)))(function(v2) {
                  return bind12(liftEffect4($$new(false)))(function(doneRef) {
                    return bind12(fork3($$finally(liftEffect4(function __do2() {
                      modify_($$delete2(fid))(v2.forks)();
                      return write(true)(doneRef)();
                    }))(evalM(render14)(ref2)(v1.value0))))(function(fiber) {
                      return discard12(liftEffect4(unlessM2(read(doneRef))(modify_(insert12(fid)(fiber))(v2.forks))))(function() {
                        return pure17(v1.value1(fid));
                      });
                    });
                  });
                });
              });
            }
            ;
            if (v1 instanceof Join) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                return bind12(liftEffect4(read(v2.forks)))(function(forkMap) {
                  return discard12(traverse_32(joinFiber)(lookup14(v1.value0)(forkMap)))(function() {
                    return pure17(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof Kill) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                return bind12(liftEffect4(read(v2.forks)))(function(forkMap) {
                  return discard12(traverse_32(killFiber(error("Cancelled")))(lookup14(v1.value0)(forkMap)))(function() {
                    return pure17(v1.value1);
                  });
                });
              });
            }
            ;
            if (v1 instanceof GetRef) {
              return bind12(liftEffect4(read(ref2)))(function(v2) {
                return pure17(v1.value1(lookup23(v1.value0)(v2.refs)));
              });
            }
            ;
            throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 83, column 12 - line 139, column 33): " + [v1.constructor.name]);
          };
        };
        return foldFree2(go2(initRef))(v);
      };
    };
  };
  var evalF = function(render14) {
    return function(ref2) {
      return function(v) {
        if (v instanceof RefUpdate) {
          return liftEffect4(flip(modify_)(ref2)(mapDriverState(function(st) {
            return {
              component: st.component,
              state: st.state,
              children: st.children,
              childrenIn: st.childrenIn,
              childrenOut: st.childrenOut,
              selfRef: st.selfRef,
              handlerRef: st.handlerRef,
              pendingQueries: st.pendingQueries,
              pendingOuts: st.pendingOuts,
              pendingHandlers: st.pendingHandlers,
              rendering: st.rendering,
              fresh: st.fresh,
              subscriptions: st.subscriptions,
              forks: st.forks,
              lifecycleHandlers: st.lifecycleHandlers,
              refs: alter2($$const(v.value1))(v.value0)(st.refs)
            };
          })));
        }
        ;
        if (v instanceof Action) {
          return bind12(liftEffect4(read(ref2)))(function(v1) {
            return evalM(render14)(ref2)(v1["component"]["eval"](new Action2(v.value0, unit)));
          });
        }
        ;
        throw new Error("Failed pattern match at Halogen.Aff.Driver.Eval (line 52, column 20 - line 58, column 62): " + [v.constructor.name]);
      };
    };
  };

  // output/Halogen.Aff.Driver/index.js
  var bind8 = /* @__PURE__ */ bind(bindEffect);
  var discard11 = /* @__PURE__ */ discard(discardUnit);
  var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
  var traverse_5 = /* @__PURE__ */ traverse_(applicativeAff)(foldableList);
  var fork4 = /* @__PURE__ */ fork2(monadForkAff);
  var bindFlipped6 = /* @__PURE__ */ bindFlipped(bindEffect);
  var traverse_13 = /* @__PURE__ */ traverse_(applicativeEffect);
  var traverse_23 = /* @__PURE__ */ traverse_13(foldableMaybe);
  var traverse_33 = /* @__PURE__ */ traverse_13(foldableMap);
  var discard24 = /* @__PURE__ */ discard11(bindAff);
  var parSequence_3 = /* @__PURE__ */ parSequence_(parallelAff)(applicativeParAff)(foldableList);
  var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var pure18 = /* @__PURE__ */ pure(applicativeEffect);
  var map26 = /* @__PURE__ */ map(functorEffect);
  var pure19 = /* @__PURE__ */ pure(applicativeAff);
  var when2 = /* @__PURE__ */ when(applicativeEffect);
  var renderStateX2 = /* @__PURE__ */ renderStateX(functorEffect);
  var $$void6 = /* @__PURE__ */ $$void(functorAff);
  var foreachSlot2 = /* @__PURE__ */ foreachSlot(applicativeEffect);
  var renderStateX_2 = /* @__PURE__ */ renderStateX_(applicativeEffect);
  var tailRecM3 = /* @__PURE__ */ tailRecM(monadRecEffect);
  var voidLeft3 = /* @__PURE__ */ voidLeft(functorEffect);
  var bind13 = /* @__PURE__ */ bind(bindAff);
  var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectEffect);
  var newLifecycleHandlers = /* @__PURE__ */ function() {
    return $$new({
      initializers: Nil.value,
      finalizers: Nil.value
    });
  }();
  var handlePending = function(ref2) {
    return function __do2() {
      var queue = read(ref2)();
      write(Nothing.value)(ref2)();
      return for_2(queue)(function() {
        var $59 = traverse_5(fork4);
        return function($60) {
          return handleAff($59(reverse2($60)));
        };
      }())();
    };
  };
  var cleanupSubscriptionsAndForks = function(v) {
    return function __do2() {
      bindFlipped6(traverse_23(traverse_33(unsubscribe)))(read(v.subscriptions))();
      write(Nothing.value)(v.subscriptions)();
      bindFlipped6(traverse_33(function() {
        var $61 = killFiber(error("finalized"));
        return function($62) {
          return handleAff($61($62));
        };
      }()))(read(v.forks))();
      return write(empty3)(v.forks)();
    };
  };
  var runUI = function(renderSpec2) {
    return function(component5) {
      return function(i2) {
        var squashChildInitializers = function(lchs) {
          return function(preInits) {
            return unDriverStateX(function(st) {
              var parentInitializer = evalM(render14)(st.selfRef)(st["component"]["eval"](new Initialize(unit)));
              return modify_(function(handlers) {
                return {
                  initializers: new Cons(discard24(parSequence_3(reverse2(handlers.initializers)))(function() {
                    return discard24(parentInitializer)(function() {
                      return liftEffect5(function __do2() {
                        handlePending(st.pendingQueries)();
                        return handlePending(st.pendingOuts)();
                      });
                    });
                  }), preInits),
                  finalizers: handlers.finalizers
                };
              })(lchs);
            });
          };
        };
        var runComponent = function(lchs) {
          return function(handler3) {
            return function(j) {
              return unComponent(function(c) {
                return function __do2() {
                  var lchs$prime = newLifecycleHandlers();
                  var $$var2 = initDriverState(c)(j)(handler3)(lchs$prime)();
                  var pre2 = read(lchs)();
                  write({
                    initializers: Nil.value,
                    finalizers: pre2.finalizers
                  })(lchs)();
                  bindFlipped6(unDriverStateX(function() {
                    var $63 = render14(lchs);
                    return function($64) {
                      return $63(function(v) {
                        return v.selfRef;
                      }($64));
                    };
                  }()))(read($$var2))();
                  bindFlipped6(squashChildInitializers(lchs)(pre2.initializers))(read($$var2))();
                  return $$var2;
                };
              });
            };
          };
        };
        var renderChild = function(lchs) {
          return function(handler3) {
            return function(childrenInRef) {
              return function(childrenOutRef) {
                return unComponentSlot(function(slot4) {
                  return function __do2() {
                    var childrenIn = map26(slot4.pop)(read(childrenInRef))();
                    var $$var2 = function() {
                      if (childrenIn instanceof Just) {
                        write(childrenIn.value0.value1)(childrenInRef)();
                        var dsx = read(childrenIn.value0.value0)();
                        unDriverStateX(function(st) {
                          return function __do3() {
                            flip(write)(st.handlerRef)(function() {
                              var $65 = maybe(pure19(unit))(handler3);
                              return function($66) {
                                return $65(slot4.output($66));
                              };
                            }())();
                            return handleAff(evalM(render14)(st.selfRef)(st["component"]["eval"](new Receive(slot4.input, unit))))();
                          };
                        })(dsx)();
                        return childrenIn.value0.value0;
                      }
                      ;
                      if (childrenIn instanceof Nothing) {
                        return runComponent(lchs)(function() {
                          var $67 = maybe(pure19(unit))(handler3);
                          return function($68) {
                            return $67(slot4.output($68));
                          };
                        }())(slot4.input)(slot4.component)();
                      }
                      ;
                      throw new Error("Failed pattern match at Halogen.Aff.Driver (line 213, column 14 - line 222, column 98): " + [childrenIn.constructor.name]);
                    }();
                    var isDuplicate = map26(function($69) {
                      return isJust(slot4.get($69));
                    })(read(childrenOutRef))();
                    when2(isDuplicate)(warn("Halogen: Duplicate slot address was detected during rendering, unexpected results may occur"))();
                    modify_(slot4.set($$var2))(childrenOutRef)();
                    return bind8(read($$var2))(renderStateX2(function(v) {
                      if (v instanceof Nothing) {
                        return $$throw("Halogen internal error: child was not initialized in renderChild");
                      }
                      ;
                      if (v instanceof Just) {
                        return pure18(renderSpec2.renderChild(v.value0));
                      }
                      ;
                      throw new Error("Failed pattern match at Halogen.Aff.Driver (line 227, column 37 - line 229, column 50): " + [v.constructor.name]);
                    }))();
                  };
                });
              };
            };
          };
        };
        var render14 = function(lchs) {
          return function($$var2) {
            return function __do2() {
              var v = read($$var2)();
              var shouldProcessHandlers = map26(isNothing)(read(v.pendingHandlers))();
              when2(shouldProcessHandlers)(write(new Just(Nil.value))(v.pendingHandlers))();
              write(empty4)(v.childrenOut)();
              write(v.children)(v.childrenIn)();
              var handler3 = function() {
                var $70 = queueOrRun(v.pendingHandlers);
                var $71 = evalF(render14)(v.selfRef);
                return function($72) {
                  return $70($$void6($71($72)));
                };
              }();
              var childHandler = function() {
                var $73 = queueOrRun(v.pendingQueries);
                return function($74) {
                  return $73(handler3(Action.create($74)));
                };
              }();
              var rendering = renderSpec2.render(function($75) {
                return handleAff(handler3($75));
              })(renderChild(lchs)(childHandler)(v.childrenIn)(v.childrenOut))(v.component.render(v.state))(v.rendering)();
              var children2 = read(v.childrenOut)();
              var childrenIn = read(v.childrenIn)();
              foreachSlot2(childrenIn)(function(v1) {
                return function __do3() {
                  var childDS = read(v1)();
                  renderStateX_2(renderSpec2.removeChild)(childDS)();
                  return finalize(lchs)(childDS)();
                };
              })();
              flip(modify_)(v.selfRef)(mapDriverState(function(ds$prime) {
                return {
                  component: ds$prime.component,
                  state: ds$prime.state,
                  refs: ds$prime.refs,
                  childrenIn: ds$prime.childrenIn,
                  childrenOut: ds$prime.childrenOut,
                  selfRef: ds$prime.selfRef,
                  handlerRef: ds$prime.handlerRef,
                  pendingQueries: ds$prime.pendingQueries,
                  pendingOuts: ds$prime.pendingOuts,
                  pendingHandlers: ds$prime.pendingHandlers,
                  fresh: ds$prime.fresh,
                  subscriptions: ds$prime.subscriptions,
                  forks: ds$prime.forks,
                  lifecycleHandlers: ds$prime.lifecycleHandlers,
                  rendering: new Just(rendering),
                  children: children2
                };
              }))();
              return when2(shouldProcessHandlers)(flip(tailRecM3)(unit)(function(v1) {
                return function __do3() {
                  var handlers = read(v.pendingHandlers)();
                  write(new Just(Nil.value))(v.pendingHandlers)();
                  traverse_23(function() {
                    var $76 = traverse_5(fork4);
                    return function($77) {
                      return handleAff($76(reverse2($77)));
                    };
                  }())(handlers)();
                  var mmore = read(v.pendingHandlers)();
                  var $52 = maybe(false)($$null)(mmore);
                  if ($52) {
                    return voidLeft3(write(Nothing.value)(v.pendingHandlers))(new Done(unit))();
                  }
                  ;
                  return new Loop(unit);
                };
              }))();
            };
          };
        };
        var finalize = function(lchs) {
          return unDriverStateX(function(st) {
            return function __do2() {
              cleanupSubscriptionsAndForks(st)();
              var f = evalM(render14)(st.selfRef)(st["component"]["eval"](new Finalize(unit)));
              modify_(function(handlers) {
                return {
                  initializers: handlers.initializers,
                  finalizers: new Cons(f, handlers.finalizers)
                };
              })(lchs)();
              return foreachSlot2(st.children)(function(v) {
                return function __do3() {
                  var dsx = read(v)();
                  return finalize(lchs)(dsx)();
                };
              })();
            };
          });
        };
        var evalDriver = function(disposed) {
          return function(ref2) {
            return function(q2) {
              return bind13(liftEffect5(read(disposed)))(function(v) {
                if (v) {
                  return pure19(Nothing.value);
                }
                ;
                return evalQ(render14)(ref2)(q2);
              });
            };
          };
        };
        var dispose = function(disposed) {
          return function(lchs) {
            return function(dsx) {
              return handleLifecycle(lchs)(function __do2() {
                var v = read(disposed)();
                if (v) {
                  return unit;
                }
                ;
                write(true)(disposed)();
                finalize(lchs)(dsx)();
                return unDriverStateX(function(v1) {
                  return function __do3() {
                    var v2 = liftEffect1(read(v1.selfRef))();
                    return for_2(v2.rendering)(renderSpec2.dispose)();
                  };
                })(dsx)();
              });
            };
          };
        };
        return bind13(liftEffect5(newLifecycleHandlers))(function(lchs) {
          return bind13(liftEffect5($$new(false)))(function(disposed) {
            return handleLifecycle(lchs)(function __do2() {
              var sio = create();
              var dsx = bindFlipped6(read)(runComponent(lchs)(function() {
                var $78 = notify(sio.listener);
                return function($79) {
                  return liftEffect5($78($79));
                };
              }())(i2)(component5))();
              return unDriverStateX(function(st) {
                return pure18({
                  query: evalDriver(disposed)(st.selfRef),
                  messages: sio.emitter,
                  dispose: dispose(disposed)(lchs)(dsx)
                });
              })(dsx)();
            });
          });
        });
      };
    };
  };

  // output/Web.DOM.Node/foreign.js
  var getEffProp2 = function(name16) {
    return function(node) {
      return function() {
        return node[name16];
      };
    };
  };
  var baseURI = getEffProp2("baseURI");
  var _ownerDocument = getEffProp2("ownerDocument");
  var _parentNode = getEffProp2("parentNode");
  var _parentElement = getEffProp2("parentElement");
  var childNodes = getEffProp2("childNodes");
  var _firstChild = getEffProp2("firstChild");
  var _lastChild = getEffProp2("lastChild");
  var _previousSibling = getEffProp2("previousSibling");
  var _nextSibling = getEffProp2("nextSibling");
  var _nodeValue = getEffProp2("nodeValue");
  var textContent = getEffProp2("textContent");
  function insertBefore(node1) {
    return function(node2) {
      return function(parent2) {
        return function() {
          parent2.insertBefore(node1, node2);
        };
      };
    };
  }
  function appendChild(node) {
    return function(parent2) {
      return function() {
        parent2.appendChild(node);
      };
    };
  }
  function removeChild2(node) {
    return function(parent2) {
      return function() {
        parent2.removeChild(node);
      };
    };
  }

  // output/Web.DOM.Node/index.js
  var map27 = /* @__PURE__ */ map(functorEffect);
  var parentNode2 = /* @__PURE__ */ function() {
    var $6 = map27(toMaybe);
    return function($7) {
      return $6(_parentNode($7));
    };
  }();
  var nextSibling = /* @__PURE__ */ function() {
    var $15 = map27(toMaybe);
    return function($16) {
      return $15(_nextSibling($16));
    };
  }();

  // output/Halogen.VDom.Driver/index.js
  var $runtime_lazy8 = function(name16, moduleName, init2) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init2();
      state3 = 2;
      return val;
    };
  };
  var $$void7 = /* @__PURE__ */ $$void(functorEffect);
  var pure20 = /* @__PURE__ */ pure(applicativeEffect);
  var traverse_6 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableMaybe);
  var unwrap5 = /* @__PURE__ */ unwrap();
  var when3 = /* @__PURE__ */ when(applicativeEffect);
  var not2 = /* @__PURE__ */ not(/* @__PURE__ */ heytingAlgebraFunction(/* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraBoolean)));
  var identity16 = /* @__PURE__ */ identity(categoryFn);
  var bind14 = /* @__PURE__ */ bind(bindAff);
  var liftEffect6 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var map28 = /* @__PURE__ */ map(functorEffect);
  var bindFlipped7 = /* @__PURE__ */ bindFlipped(bindEffect);
  var substInParent = function(v) {
    return function(v1) {
      return function(v2) {
        if (v1 instanceof Just && v2 instanceof Just) {
          return $$void7(insertBefore(v)(v1.value0)(v2.value0));
        }
        ;
        if (v1 instanceof Nothing && v2 instanceof Just) {
          return $$void7(appendChild(v)(v2.value0));
        }
        ;
        return pure20(unit);
      };
    };
  };
  var removeChild3 = function(v) {
    return function __do2() {
      var npn = parentNode2(v.node)();
      return traverse_6(function(pn) {
        return removeChild2(v.node)(pn);
      })(npn)();
    };
  };
  var mkSpec = function(handler3) {
    return function(renderChildRef) {
      return function(document2) {
        var getNode = unRenderStateX(function(v) {
          return v.node;
        });
        var done = function(st) {
          if (st instanceof Just) {
            return halt(st.value0);
          }
          ;
          return unit;
        };
        var buildWidget2 = function(spec) {
          var buildThunk2 = buildThunk(unwrap5)(spec);
          var $lazy_patch = $runtime_lazy8("patch", "Halogen.VDom.Driver", function() {
            return function(st, slot4) {
              if (st instanceof Just) {
                if (slot4 instanceof ComponentSlot) {
                  halt(st.value0);
                  return $lazy_renderComponentSlot(100)(slot4.value0);
                }
                ;
                if (slot4 instanceof ThunkSlot) {
                  var step$prime = step(st.value0, slot4.value0);
                  return mkStep(new Step(extract2(step$prime), new Just(step$prime), $lazy_patch(103), done));
                }
                ;
                throw new Error("Failed pattern match at Halogen.VDom.Driver (line 97, column 22 - line 103, column 79): " + [slot4.constructor.name]);
              }
              ;
              return $lazy_render(104)(slot4);
            };
          });
          var $lazy_render = $runtime_lazy8("render", "Halogen.VDom.Driver", function() {
            return function(slot4) {
              if (slot4 instanceof ComponentSlot) {
                return $lazy_renderComponentSlot(86)(slot4.value0);
              }
              ;
              if (slot4 instanceof ThunkSlot) {
                var step3 = buildThunk2(slot4.value0);
                return mkStep(new Step(extract2(step3), new Just(step3), $lazy_patch(89), done));
              }
              ;
              throw new Error("Failed pattern match at Halogen.VDom.Driver (line 84, column 7 - line 89, column 75): " + [slot4.constructor.name]);
            };
          });
          var $lazy_renderComponentSlot = $runtime_lazy8("renderComponentSlot", "Halogen.VDom.Driver", function() {
            return function(cs) {
              var renderChild = read(renderChildRef)();
              var rsx = renderChild(cs)();
              var node = getNode(rsx);
              return mkStep(new Step(node, Nothing.value, $lazy_patch(117), done));
            };
          });
          var patch = $lazy_patch(91);
          var render14 = $lazy_render(82);
          var renderComponentSlot = $lazy_renderComponentSlot(109);
          return render14;
        };
        var buildAttributes = buildProp(handler3);
        return {
          buildWidget: buildWidget2,
          buildAttributes,
          document: document2
        };
      };
    };
  };
  var renderSpec = function(document2) {
    return function(container) {
      var render14 = function(handler3) {
        return function(child) {
          return function(v) {
            return function(v1) {
              if (v1 instanceof Nothing) {
                return function __do2() {
                  var renderChildRef = $$new(child)();
                  var spec = mkSpec(handler3)(renderChildRef)(document2);
                  var machine = buildVDom(spec)(v);
                  var node = extract2(machine);
                  $$void7(appendChild(node)(toNode2(container)))();
                  return {
                    machine,
                    node,
                    renderChildRef
                  };
                };
              }
              ;
              if (v1 instanceof Just) {
                return function __do2() {
                  write(child)(v1.value0.renderChildRef)();
                  var parent2 = parentNode2(v1.value0.node)();
                  var nextSib = nextSibling(v1.value0.node)();
                  var machine$prime = step(v1.value0.machine, v);
                  var newNode = extract2(machine$prime);
                  when3(not2(unsafeRefEq)(v1.value0.node)(newNode))(substInParent(newNode)(nextSib)(parent2))();
                  return {
                    machine: machine$prime,
                    node: newNode,
                    renderChildRef: v1.value0.renderChildRef
                  };
                };
              }
              ;
              throw new Error("Failed pattern match at Halogen.VDom.Driver (line 157, column 5 - line 173, column 80): " + [v1.constructor.name]);
            };
          };
        };
      };
      return {
        render: render14,
        renderChild: identity16,
        removeChild: removeChild3,
        dispose: removeChild3
      };
    };
  };
  var runUI2 = function(component5) {
    return function(i2) {
      return function(element3) {
        return bind14(liftEffect6(map28(toDocument)(bindFlipped7(document)(windowImpl))))(function(document2) {
          return runUI(renderSpec(document2)(element3))(component5)(i2);
        });
      };
    };
  };

  // output/Foliage.App.Main/index.js
  var bindFlipped8 = /* @__PURE__ */ bindFlipped(bindAff);
  var main2 = /* @__PURE__ */ runHalogenAff(/* @__PURE__ */ discard(discardUnit)(bindAff)(/* @__PURE__ */ log2(monadEffectAff)("[Foliage.App.Main]"))(function() {
    return bindFlipped8(runUI2(component4)({}))(awaitBody);
  }));

  // <stdin>
  main2();
})();
//# sourceMappingURL=foliage.js.map
