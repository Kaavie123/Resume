(function () {
    var touch = {};

    //����������
    function bind(context, callBack) {
        var outerArg = [].slice.call(arguments, 2);
        return function () {
            var innerArg = [].slice.call(arguments, 0);
            var arg = innerArg.concat(outerArg);
            callBack.apply(context, arg);
        }
    }

    //����Ƿ��ǻ����¼�
    function isSwipe(strX, endX, strY, endY) {
        return Math.abs(endX - strX) > 30 || Math.abs(endY - strY) > 30;
    }

    //��⵱ǰ�����ķ���
    function swipeDirection(strX, endX, strY, endY) {
        return Math.abs(endX - strX) > Math.abs(endY - strY) ? ((endX - strX) > 0 ? "Right" : "Left") : ((endY - strY) > 0 ? "Down" : "Up");
    }

    //��ʼ��д�¼�����������:touchStart��touchMove��touchEnd
    //name:����ģ����¼�����"tap", "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown"
    //callback:ÿһ�׶����ǵ�������������
    function touchStart(e, name, callback) {
        e.preventDefault();
        var touchPoint = e.touches[0];
        this["strX" + name] = touchPoint.pageX;
        this["strY" + name] = touchPoint.pageY;
        typeof callback === "function" ? callback.call(this, e) : null;
    }

    function touchMove(e, name, callback) {
        e.preventDefault();
        var touchPoint = e.touches[0];
        this["endX" + name] = touchPoint.pageX;
        this["endY" + name] = touchPoint.pageY;
        this["isSwipe" + name] = isSwipe(this["strX" + name], this["endX" + name], this["strY" + name], this["endY" + name]);
        checkEvent.call(this, e, name, callback);
    }

    function touchEnd(e, name, callBack) {
        e.preventDefault();
        checkEvent.call(this, e, name, callBack);
        initDefault.call(this, e, name);
    }

    //���ݴ��ݽ������¼����ͺ͵�ǰ�û�����Ϊ���бȽ�,����ж��Ƿ���д���
    function checkEvent(e, name, callBack) {
        var isSwipe = this["isSwipe" + name];
        switch (name) {
            case "tap":
                !isSwipe && typeof callBack === "function" ? callBack.call(this, e) : null;
                break;
            case "swipe":
                isSwipe && typeof callBack === "function" ? callBack.call(this, e) : null;
                break;
            default:
                if (isSwipe) {
                    var swipeDir = swipeDirection(this["strX" + name], this["endX" + name], this["strY" + name], this["endY" + name]);
                    if (name === "swipe" + swipeDir) {
                        typeof callBack === "function" ? callBack.call(this, e) : null;
                    }
                }
        }
    }

    //��touch�¼�����������õ��Զ�������ֵ�ع鵽ԭʼ��״̬
    function initDefault(e, name) {
        ["strX", "endX", "strY", "endY", "isSwipe"].forEach(function (item) {
            this[item + name] = null;
        }, this);
    }


    //options:{start:function->��ʼ�������� move:function->������������ end:function->������������}
    function init(name) {
        return function (curEle, options) {
            ["start", "move", "end"].forEach(function (item) {
                var fn = item === "start" ? touchStart : (item === "move" ? touchMove : touchEnd);
                var tempFn = bind(curEle, fn, name, options[item]);
                curEle["my" + item + name] = tempFn;
                curEle.addEventListener("touch" + item, tempFn, false);
            });
            return this;//->Ϊ��ʵ����ʽд��
        }
    }

    function uninit(curEle) {
        ["tap", "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown"].forEach(function (name) {
            ["start", "move", "end"].forEach(function (item) {
                var tempFn = curEle["my" + item + name];
                curEle.removeEventListener("touch" + item, tempFn, false);
            });
        });
    }

    ["tap", "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown"].forEach(function (item) {
        touch[item] = init(item);
    });
    touch.uninit = uninit;

    window.zhufengTouch = window.$t = touch;
})();