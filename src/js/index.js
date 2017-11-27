(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var v = new Vue({
    el: 'body',
    data: {
        fixed: false,
        uri: 'https://api.xys.ren/interface/html.php',
        // uri: 'http://120.27.194.197/1/206/interface/html.php',
        wait: false,
        ios: false,
        imgs: null,
        hash: '#',
        h: 0,
        scr: 0,
        page: 1,
        bonus: [],
        input: null,
        require: false,
        des: {
            des1: 0,
            des2: 0
        },
        index: null,
        rotate: false,
        resultText: null,
        btnText: null,
        msg: null,
        type: null,
        message: null,
        barrageList: null,
        result: false,
        data:[5,10,20,30,50,66,166],
        times: null
    },
    methods: {
        back: function(id) {
            window.open('http://xys/xys_force_back');
        },
        openId: function(id) {
            window.open('xys://xys/goods?goods_id=' + id)
        },
        getId: function(id) {
            var that = this

            if (!that.input) {
                alert('请在App上打开')
                return false
            }

            if (this.wait) return
            this.wait = true
            $.post('https://port.xys.ren/245/interface/shop.php?input=' + that.input, {
                    key: 　id,
                    action: 'exchange_package'
                },
                function(e) {
                    that.wait = false;
                    e = JSON.parse(e)
                    if (e.content == "请登录") {
                        alert("请登录,如果已登录,请重新打开App");
                    } else {
                        alert(e.content);
                    }
                }
            )
        },
        rotary: function(){
          var that = this
          if(this.rotate) return
          this.rotate = true;
          this.result = false;
          var allNum = 7
          $.post(that.uri + "?input=" + that.input, { action: 'wheelStart'}, function(e) {
                var e = JSON.parse(e);
                console.log(e);
                that.index = e.data-1
                that.times = e.times
                if (e.status===1) {
                    switch (e.data) {
                      case 1:
                        that.rotateFunc(e.data, 360 / allNum / 2);
                        break;
                      case 2:
                        that.rotateFunc(e.data, (360 / allNum / 2) * 3);
                        break;
                      case 3:
                        that.rotateFunc(e.data, (360 / allNum / 2) * 5);
                        break;
                      case 4:
                        that.rotateFunc(e.data, (360 / allNum / 2) * 7);
                        break;
                      case 5:
                        that.rotateFunc(e.data, (360 / allNum / 2) * 9);
                        break;
                      case 6:
                        that.rotateFunc(e.data, (360 / allNum / 2) * 11);
                        break;
                      default:
                        that.rotateFunc(e.data, (360 / allNum / 2) * 13);
                    }
                } else {
                    $('.alert').show();
                    that.msg = e.content;
                    setTimeout(function() {
                        $('.alert').hide();
                        that.rotate = false;
                    }, 2000)
                }
            });
        },
        close: function(){
          this.result = false
        },
        rotateFunc: function (awards, angle) { //awards:奖项，angle:奖项对应的角度
          var $rotaryArrow = $('.rotaryArrow')         
          var that = this; 
          $rotaryArrow.stopRotate();
          $rotaryArrow.rotate({
            angle: 0,
            duration: 5000,
            animateTo: angle + 1440, //angle是图片上各奖项对应的角度，1440是让指针固定旋转4圈
            callback: function () {
              that.result = true
              that.rotate = false
            }
          })
        }
    },
    ready: function() { 
        var that = this
        var pos
        this.h = window.innerHeight + 100;
        $('body').show();
        $.ajax({
            async: false
        });
        if (/iphone/ig.test(navigator.appVersion)) {
            this.ios = true
        }
        var args = location.search.replace('?', '').split('=');
        if (args[0] == "input") {
            this.input = args[1];
        }
    }
});
