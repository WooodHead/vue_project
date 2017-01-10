<template>
  <div class="vux-rater">
    <div v-if="!isshowall">
      <a class="vux-rater-box" v-for="(i,item) in innerItems" @click="handleClick(i)"
         :class="{'is-active':value === i}"
         :style="{color: value === i ? item.starColor : '#ccc',marginRight:margin+'px',fontSize: fontSize + 'px', width: fontSize + 'px', height: fontSize + 'px', lineHeight: fontSize + 'px'}">
        <span class="vux-rater-inner">{{item.starImg}}</span>
      </a>
    </div>
    <div v-else>
      <div>
        <a class="vux-rater-box" v-for="item in innerItems">
          <span class="vux-rater-inner"
                :style="{color:item.starColor,marginRight:margin+'px',fontSize: fontSize + 'px', width: fontSize + 'px', height: fontSize + 'px', lineHeight: fontSize + 'px'}">{{item.starImg}}</span>
          <span style="color:#000;" v-if="item.ResultName">({{item.ResultName}})</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  const redColor = '#f74c31'
  const yellowColor = '#FF9900'
  const greenColor = '#04BE02'
  export default {
    props: {
      items: {
        type: Array,
        default: []
      },
      data: undefined,
      isshowall: false,
      selectItem: Object,
      value: {
        type: Number,
        default: -1
      },
      disabled: Boolean,
      activeColor: {
        type: String,
        default: '#fc6'
      },
      margin: {
        type: Number,
        default: 2
      },
      fontSize: {
        type: Number,
        default: 25
      }
    },
    methods: {
      handleClick (i, force) {
        if (!this.disabled || force) {
          this.value = i
          this.selectItem = this.items[i]
          this.$emit('item-select', this.selectItem, this.data)
        }
      }
    },
    computed: {
      innerItems() {
        // `this` points to the vm instance
        if (this.items && this.items.length > 0) {
          if (this.items.length === 1) {
            this.value = 0
          }
          for (var i in this.items) {
            let item = this.items[i]
            if (this.selectItem && this.selectItem.ResultCode && this.value === -1) {
              if (this.selectItem && this.selectItem.ResultCode === item.ResultCode) {
                this.value = parseInt(i)
              }
            }
            switch (item.ResultCode) {
              case 'YOU':
                item.starImg = '★'
                item.starColor = redColor
                break
              case 'LIANG':
                item.starImg = '▲'
                item.starColor = yellowColor
                break
              case 'CHA':
                item.starImg = '√'
                item.starColor = greenColor
                break
            }
          }
          if (this.value > -1 && !this.selectItem && this.value < this.items.length) {
            this.selectItem = this.items[this.value]
          }
        }
        return this.items
      }
    }
  }
</script>

<style>
.vux-rater {
  text-align: left;
  display: inline-block;
  line-height: normal;
}
.vux-rater a {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  color: #ccc;
}
.vux-rater a:last-child {
  padding-right: 2px!important;
  margin-right: 0px!important;
}
.vux-rater a:hover {
  color: #ffdd99;
}
.vux-rater a.is-disabled {
  color: #ccc !important;
  cursor: not-allowed;
}
.vux-rater-box {
  position: relative;
}
.vux-rater-inner {
  position: relative;
  display: inline-block;
}

</style>
