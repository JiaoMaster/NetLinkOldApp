<template>
    <!-- #ifndef APP-NVUE -->
    <button
        :hover-start-time="Number(hoverStartTime)"
        :hover-stay-time="Number(hoverStayTime)"
        :form-type="formType"
        :open-type="openType"
        :app-parameter="appParameter"
        :hover-stop-propagation="hoverStopPropagation"
        :send-message-title="sendMessageTitle"
        :send-message-path="sendMessagePath"
        :lang="lang"
        :data-name="dataName"
        :session-from="sessionFrom"
        :send-message-img="sendMessageImg"
        :show-message-card="showMessageCard"
        @getphonenumber="getphonenumber"
        @getuserinfo="getuserinfo"
        @error="error"
        @opensetting="opensetting"
        @launchapp="launchapp"
        :hover-class="!disabled && !loading ? 'u-button--active' : ''"
        class="u-button u-reset-button"
        :style="[baseColor, $u.addStyle(customStyle)]"
        @tap="clickHandler"
        :class="bemClass"
    >
        <template v-if="loading">
            <u-loading-icon
                :mode="loadingMode"
                :size="textSize * 1.15"
                :color="loadingColor"
            ></u-loading-icon>
            <text
                class="u-button__loading-text"
                :style="[{ fontSize: textSize + 'px' }]"
                >{{ loadingText || text }}</text
            >
        </template>
        <template v-else>
            <u-icon
                v-if="icon"
                :name="icon"
                :color="iconColorCom"
                :size="textSize * 1.35"
                :customStyle="{ marginRight: '2px' }"
            ></u-icon>
            <slot>
                <text
                    class="u-button__text"
                    :style="[{ fontSize: textSize + 'px' }]"
                    >{{ text }}</text
                >
            </slot>
        </template>
    </button>
    <!-- #endif -->

    <!-- #ifdef APP-NVUE -->
    <view
        :hover-start-time="Number(hoverStartTime)"
        :hover-stay-time="Number(hoverStayTime)"
        class="u-button"
        :hover-class="
            !disabled && !loading && !color && (plain || type === 'info')
                ? 'u-button--active--plain'
                : !disabled && !loading && !plain
                ? 'u-button--active'
                : ''
        "
        @tap="clickHandler"
        :class="bemClass"
        :style="[baseColor, $u.addStyle(customStyle)]"
    >
        <template v-if="loading">
            <u-loading-icon
                :mode="loadingMode"
                :size="textSize * 1.15"
                :color="loadingColor"
            ></u-loading-icon>
            <text
                class="u-button__loading-text"
                :style="[nvueTextStyle]"
                :class="[plain && `u-button__text--plain--${type}`]"
                >{{ loadingText || text }}</text
            >
        </template>
        <template v-else>
            <u-icon
                v-if="icon"
                :name="icon"
                :color="iconColorCom"
                :size="textSize * 1.35"
            ></u-icon>
            <text
                class="u-button__text"
                :style="[
                    {
                        marginLeft: icon ? '2px' : 0,
                    },
                    nvueTextStyle,
                ]"
                :class="[plain && `u-button__text--plain--${type}`]"
                >{{ text }}</text
            >
        </template>
    </view>
    <!-- #endif -->
</template>

<script>
import button from "../../libs/mixin/button.js";
import openType from "../../libs/mixin/openType.js";
import props from "./props.js";
/**
 * button ??????
 * @description Button ??????
 * @tutorial https://www.uviewui.com/components/button.html
 *
 * @property {Boolean}			hairline				?????????????????????????????? (?????? true )
 * @property {String}			type					????????????????????????info???primary???error???warning???success (?????? 'info' )
 * @property {String}			size					???????????????large???normal???mini ????????? normal???
 * @property {String}			shape					???????????????circle????????????????????????square??????????????? ????????? 'square' ???
 * @property {Boolean}			plain					???????????????????????????????????? ????????? false???
 * @property {Boolean}			disabled				???????????? ????????? false???
 * @property {Boolean}			loading					???????????????????????? loading ??????(App-nvue ???????????? ios ???????????????Android????????????) ????????? false???
 * @property {String | Number}	loadingText				?????????????????????
 * @property {String}			loadingMode				???????????????????????? ????????? 'spinner' ???
 * @property {String | Number}	loadingSize				?????????????????? ????????? 15 ???
 * @property {String}			openType				???????????????????????????uniapp????????????button??????????????????
 * @property {String}			formType				?????? <form> ?????????????????????????????? <form> ????????? submit/reset ??????
 * @property {String}			appParameter			?????? APP ????????? APP ??????????????????open-type=launchApp????????? ??????????????????????????????QQ??????????????????
 * @property {Boolean}			hoverStopPropagation	?????????????????????????????????????????????????????????????????????????????????????????? true ???
 * @property {String}			lang					????????????????????????????????????zh_CN ???????????????zh_TW ???????????????en ??????????????? en ???
 * @property {String}			sessionFrom				???????????????openType="contact"?????????
 * @property {String}			sendMessageTitle		??????????????????????????????openType="contact"?????????
 * @property {String}			sendMessagePath			???????????????????????????????????????????????????openType="contact"?????????
 * @property {String}			sendMessageImg			??????????????????????????????openType="contact"?????????
 * @property {Boolean}			showMessageCard			?????????????????????????????????????????????????????? true????????????????????????????????????????????????"???????????????????????????"????????????????????????????????????????????????????????????openType="contact"??????????????????false???
 * @property {String}			dataName				???????????????????????????????????????data-xxx???????????????target.dataset.name??????
 * @property {String | Number}	throttleTime			?????????????????????????????????????????? ????????? 0 )
 * @property {String | Number}	hoverStartTime			????????????????????????????????????????????? ????????? 0 )
 * @property {String | Number}	hoverStayTime			??????????????????????????????????????????????????? ????????? 200 )
 * @property {String | Number}	text					??????????????????????????????props??????????????????slot?????????????????????nvue?????????????????????????????????
 * @property {String}			icon					????????????
 * @property {String}			iconColor				??????????????????
 * @property {String}			color					???????????????????????????linear-gradient?????????
 * @property {Object}			customStyle				?????????????????????????????????
 *
 * @event {Function}	click			??????????????????????????????????????????
 * @event {Function}	getphonenumber	open-type="getPhoneNumber"?????????
 * @event {Function}	getuserinfo		?????????????????????????????????????????????????????????????????????????????????detail?????????????????????uni.getUserInfo
 * @event {Function}	error			????????????????????????????????????????????????
 * @event {Function}	opensetting		??????????????????????????????????????????
 * @event {Function}	launchapp		?????? APP ???????????????
 * @example <u-button>??????</u-button>
 */
export default {
    name: "u-button",
    // #ifdef MP
    mixins: [uni.$u.mpMixin, uni.$u.mixin, button, openType, props],
    // #endif
    // #ifndef MP
    mixins: [uni.$u.mpMixin, uni.$u.mixin, props],
    // #endif
    data() {
        return {};
    },
    computed: {
        // ??????bem???????????????
        bemClass() {
            // this.bem?????????computed????????????mixin???
            if (!this.color) {
                return this.bem(
                    "button",
                    ["type", "shape", "size"],
                    ["disabled", "plain", "hairline"]
                );
            } else {
                // ??????nvue??????????????????color???????????????????????????type??????????????????type???????????????????????????????????????
                return this.bem(
                    "button",
                    ["shape", "size"],
                    ["disabled", "plain", "hairline"]
                );
            }
        },
        loadingColor() {
            if (this.plain) {
                // ???????????????color????????????color??????????????????type????????????
                return this.color
                    ? this.color
                    : uni.$u.config.color[`u-${this.type}`];
            }
            if (this.type === "info") {
                return "#c9c9c9";
            }
            return "rgb(200, 200, 200)";
        },
        iconColorCom() {
            // ?????????????????????????????????color??????color?????????????????????????????????
            // u-icon???color?????????????????????????????????
			if (this.iconColor) return this.iconColor;
			if (this.plain) {
                return this.color ? this.color : this.type;
            } else {
                return this.type === "info" ? "#000000" : "#ffffff";
            }
        },
        baseColor() {
            let style = {};
            if (this.color) {
                // ??????????????????color???????????????????????????????????????????????????????????????
                style.color = this.plain ? this.color : "white";
                if (!this.plain) {
                    // ?????????????????????????????????????????????
                    style["background-color"] = this.color;
                }
                if (this.color.indexOf("gradient") !== -1) {
                    // ?????????????????????????????????????????????????????????????????????backgroundImage???????????????
                    // weex?????????????????????borderWidth?????????????????????????????????????????????
                    // ??????weex????????????????????????????????????????????????????????????????????????????????????????????????
                    style.borderTopWidth = 0;
                    style.borderRightWidth = 0;
                    style.borderBottomWidth = 0;
                    style.borderLeftWidth = 0;
                    if (!this.plain) {
                        style.backgroundImage = this.color;
                    }
                } else {
                    // ?????????????????????????????????????????????
                    style.borderColor = this.color;
                    style.borderWidth = "1px";
                    style.borderStyle = "solid";
                }
            }
            return style;
        },
        // nvue????????????????????????????????????????????????????????????????????????text???????????????????????????
        nvueTextStyle() {
            let style = {};
            // ??????????????????color???????????????????????????????????????????????????????????????
            if (this.type === "info") {
                style.color = "#323233";
            }
            if (this.color) {
                style.color = this.plain ? this.color : "white";
            }
            style.fontSize = this.textSize + "px";
            return style;
        },
        // ????????????
        textSize() {
            let fontSize = 14,
                { size } = this;
            if (size === "large") fontSize = 30;
            if (size === "normal") fontSize = 24;
            if (size === "small") fontSize = 15;
            if (size === "mini") fontSize = 10;
            return fontSize;
        },
    },
    methods: {
        clickHandler() {
            // ??????????????????????????????????????????
            if (!this.disabled && !this.loading) {
				// ????????????????????????this.throttle?????????????????????????????????
				uni.$u.throttle(() => {
					this.$emit("click");
				}, this.throttleTime);
            }
        },
        // ???????????????uniapp?????????????????????????????????????????????
        getphonenumber(res) {
            this.$emit("getphonenumber", res);
        },
        getuserinfo(res) {
            this.$emit("getuserinfo", res);
        },
        error(res) {
            this.$emit("error", res);
        },
        opensetting(res) {
            this.$emit("opensetting", res);
        },
        launchapp(res) {
            this.$emit("launchapp", res);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../libs/css/components.scss";

/* #ifndef APP-NVUE */
@import "./vue.scss";
/* #endif */

/* #ifdef APP-NVUE */
@import "./nvue.scss";
/* #endif */

$u-button-u-button-height: 40px !default;
$u-button-text-font-size: 25px !default;
$u-button-loading-text-font-size: 15px !default;
$u-button-loading-text-margin-left: 4px !default;
$u-button-large-width: 100% !default;
$u-button-large-height: 50px !default;
$u-button-normal-padding: 0 12px !default;
$u-button-large-padding: 0 15px !default;
$u-button-normal-font-size: 25px !default;
$u-button-small-min-width: 60px !default;
$u-button-small-height: 30px !default;
$u-button-small-padding: 0px 8px !default;
$u-button-mini-padding: 0px 8px !default;
$u-button-small-font-size: 12px !default;
$u-button-mini-height: 22px !default;
$u-button-mini-font-size: 10px !default;
$u-button-mini-min-width: 50px !default;
$u-button-disabled-opacity: 0.5 !default;
$u-button-info-color: #323233 !default;
$u-button-info-background-color: #fff !default;
$u-button-info-border-color: #ebedf0 !default;
$u-button-info-border-width: 1px !default;
$u-button-info-border-style: solid !default;
$u-button-success-color: #fff !default;
$u-button-success-background-color: $u-success !default;
$u-button-success-border-color: $u-button-success-background-color !default;
$u-button-success-border-width: 1px !default;
$u-button-success-border-style: solid !default;
$u-button-primary-color: #fff !default;
$u-button-primary-background-color: $u-primary !default;
$u-button-primary-border-color: $u-button-primary-background-color !default;
$u-button-primary-border-width: 1px !default;
$u-button-primary-border-style: solid !default;
$u-button-error-color: #fff !default;
$u-button-error-background-color: $u-error !default;
$u-button-error-border-color: $u-button-error-background-color !default;
$u-button-error-border-width: 1px !default;
$u-button-error-border-style: solid !default;
$u-button-warning-color: #fff !default;
$u-button-warning-background-color: $u-warning !default;
$u-button-warning-border-color: $u-button-warning-background-color !default;
$u-button-warning-border-width: 1px !default;
$u-button-warning-border-style: solid !default;
$u-button-block-width: 100% !default;
$u-button-circle-border-top-right-radius: 100px !default;
$u-button-circle-border-top-left-radius: 100px !default;
$u-button-circle-border-bottom-left-radius: 100px !default;
$u-button-circle-border-bottom-right-radius: 100px !default;
$u-button-square-border-top-right-radius: 3px !default;
$u-button-square-border-top-left-radius: 3px !default;
$u-button-square-border-bottom-left-radius: 3px !default;
$u-button-square-border-bottom-right-radius: 3px !default;
$u-button-icon-min-width: 1em !default;
$u-button-plain-background-color: #fff !default;
$u-button-hairline-border-width: 0.5px !default;

.u-button {
    height: $u-button-u-button-height;
    position: relative;
    align-items: center;
    justify-content: center;
    @include flex;
    /* #ifndef APP-NVUE */
    box-sizing: border-box;
    /* #endif */
    flex-direction: row;

    &__text {
        font-size: $u-button-text-font-size;
    }

    &__loading-text {
        font-size: $u-button-loading-text-font-size;
        margin-left: $u-button-loading-text-margin-left;
    }

    &--large {
        /* #ifndef APP-NVUE */
        width: $u-button-large-width;
        /* #endif */
        height: $u-button-large-height;
        padding: $u-button-large-padding;
    }

    &--normal {
        padding: $u-button-normal-padding;
        font-size: $u-button-normal-font-size;
    }

    &--small {
        /* #ifndef APP-NVUE */
        min-width: $u-button-small-min-width;
        /* #endif */
        height: $u-button-small-height;
        padding: $u-button-small-padding;
        font-size: $u-button-small-font-size;
    }

    &--mini {
        height: $u-button-mini-height;
        font-size: $u-button-mini-font-size;
        /* #ifndef APP-NVUE */
        min-width: $u-button-mini-min-width;
        /* #endif */
        padding: $u-button-mini-padding;
    }

    &--disabled {
        opacity: $u-button-disabled-opacity;
    }

    &--info {
        color: $u-button-info-color;
        background-color: $u-button-info-background-color;
        border-color: $u-button-info-border-color;
        border-width: $u-button-info-border-width;
        border-style: $u-button-info-border-style;
    }

    &--success {
        color: $u-button-success-color;
        background-color: $u-button-success-background-color;
        border-color: $u-button-success-border-color;
        border-width: $u-button-success-border-width;
        border-style: $u-button-success-border-style;
    }

    &--primary {
        color: $u-button-primary-color;
        background-color: $u-button-primary-background-color;
        border-color: $u-button-primary-border-color;
        border-width: $u-button-primary-border-width;
        border-style: $u-button-primary-border-style;
    }

    &--error {
        color: $u-button-error-color;
        background-color: $u-button-error-background-color;
        border-color: $u-button-error-border-color;
        border-width: $u-button-error-border-width;
        border-style: $u-button-error-border-style;
    }

    &--warning {
        color: $u-button-warning-color;
        background-color: $u-button-warning-background-color;
        border-color: $u-button-warning-border-color;
        border-width: $u-button-warning-border-width;
        border-style: $u-button-warning-border-style;
    }

    &--block {
        @include flex;
        width: $u-button-block-width;
    }

    &--circle {
        border-top-right-radius: $u-button-circle-border-top-right-radius;
        border-top-left-radius: $u-button-circle-border-top-left-radius;
        border-bottom-left-radius: $u-button-circle-border-bottom-left-radius;
        border-bottom-right-radius: $u-button-circle-border-bottom-right-radius;
    }

    &--square {
        border-bottom-left-radius: $u-button-square-border-top-right-radius;
        border-bottom-right-radius: $u-button-square-border-top-left-radius;
        border-top-left-radius: $u-button-square-border-bottom-left-radius;
        border-top-right-radius: $u-button-square-border-bottom-right-radius;
    }

    &__icon {
        /* #ifndef APP-NVUE */
        min-width: $u-button-icon-min-width;
        line-height: inherit !important;
        vertical-align: top;
        /* #endif */
    }

    &--plain {
        background-color: $u-button-plain-background-color;
    }

    &--hairline {
        border-width: $u-button-hairline-border-width !important;
    }
}
</style>
