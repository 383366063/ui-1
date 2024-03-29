/*
 *
 * @description:自定义滚动条
 * */

define(function (require, exports, module) {

    /*构造函数*/
    var Scroller = function (el, options) {
        this.$scroller = $(el);
        this.options = $.extend({}, Scroller.options, options);
        this.init();
    };

    Scroller.prototype.init = function () {

        this.$scroller.addClass("scroller").wrapInner('<div class="contentWrap"></div>');
        this.$content = this.$scroller.find(".contentWrap");
        if (this.getHeight(this.$content) - this.getHeight(this.$scroller) < 0) {//高度不够时将不会触发滚动条
            return false;
        }
        this.$scrollBar = this.scrollBar();
        //设置滚动条的高度
        this.$scrollBtn = this.$scrollBar.find(".scrollBtn");

        if (this.options.theme === "flat") {
            this.$scroller.addClass("flat");
        }
        this.bindEvent();
    };
    Scroller.prototype.bindEvent = function () {

        var _this = this;

        var scrollContainer = this.$scroller[0];
        if (window.addEventListener) {
            scrollContainer.addEventListener("mousewheel", $.proxy(this.scroll, this), false); //IE9, Chrome, Safari, Oper
            scrollContainer.addEventListener("DOMMouseScroll", $.proxy(this.scroll, this), false); //Firefox
        } else {
            scrollContainer.attachEvent("onmousewheel", $.proxy(this, this.scroll), false); //IE 6/7/8
        }

        this.$scrollBtn.on("mousedown.md", function (e) {
            var disY = _this.$content.position().top;
            $(document).on("mousemove.md", function (ev) {
                var scrollHeight = _this.$content.innerHeight() - _this.$scroller.innerHeight(),//滚动内容高度,
                    scrollBarHeight = _this.$scrollBar.innerHeight() - _this.$scrollBtn.innerHeight();//滚动条的滚动高度
                var top = disY + (e.clientY - ev.clientY) * scrollHeight / scrollBarHeight;//将滚动条的滚动距离转化为内容的滚动位移
                _this.setPosition(top);
            });

            $(document).on("mouseup.md", function () {
                $(document).off("mousemove.md");
            });

            return false;
        })
    };

    Scroller.prototype.scroll = function (e) {
        e = window.event || e;
        var top,
            delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY || -e.detail))); //滚轮

        if (delta > 0) {//向上滚动
            top = this.$content.position().top + 10;
        } else {//向下滚动
            top = this.$content.position().top - 10;
        }
        this.setPosition(top);
    };
    Scroller.prototype.setPosition = function (offset) {
        var scrollHeight = this.$content.innerHeight() - this.$scroller.innerHeight(),//滚动内容高度,
            scrollBarHeight = this.$scrollBar.innerHeight() - this.$scrollBtn.innerHeight();//滚动条的滚动高度

        offset = Math.min(0, offset) && Math.max(-scrollHeight, offset);//边界控制

        var scrollBarTop = -scrollBarHeight * offset / scrollHeight;
        this.$content.css("top", offset);
        this.$scrollBtn.css("top", scrollBarTop);
    };

    Scroller.prototype.scrollBar = function () {
        var $scrollBar = $('<div class="scrollBar"><div class="scrollBtn"></div> </div>').appendTo(this.$scroller);
        $scrollBar.find(".scrollBtn").css("height", Math.max(30, this.$scroller.innerHeight() * this.$scroller.innerHeight() / this.$content.innerHeight()));
        return $scrollBar;
    };

    Scroller.prototype.getHeight = function ($target) {
        var preStyle = this.$scroller.attr("style");
        if (this.$scroller.css("display") === "none") {//隐藏时
            this.$scroller.css({position: "absolute", visibility: "hidden", display: "block"})
        }
        var height = $target.outerHeight();
        this.$scroller.attr("style", preStyle);

        return height;
    };

    $.fn.scroller = function (options) {
        return this.each(function () {
            new Scroller(this, options);
        })
    };

    $("[data-toggle='scroller']").each(function () {
        new Scroller(this);
    });

    module.exports = Scroller;
});