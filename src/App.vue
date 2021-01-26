<template>
    <div class="layout">
        <Layout style="height: 100%;">
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <div class="layout-logo">{{ logoText }}</div>    
                <Menu :active-name="active" theme="dark" width="auto" :class="menuitemClasses" @on-select="handleMenu">
                    <MenuItem :name="item.path" v-for="item in menuData" :key="item.path">
                        <Icon :type="item.icon"></Icon>
                        <span>{{ item.name }}</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                    <div id="app">
                        <router-view/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import request from './http/request'

export default {
  name: 'App',
  mixins: [],
  components: {

  },
  data () {
    return {
      active: '',
      isCollapsed: false,
      menuData: [], // 导航菜单
    }
  },
  computed: {
    logoText () {
        let text = "Logo"
          if(this.isCollapsed) {
              text = "L"
          }
        return text
    },
    rotateIcon () {
        return [
            'menu-icon',
            this.isCollapsed ? 'rotate-icon' : ''
        ];
    },
    menuitemClasses () {
        return [
            'menu-item',
            this.isCollapsed ? 'collapsed-menu' : ''
        ]
    }
  },
  created() {
    this.initMenu();
  },
  methods: {
      /**
        获取导航菜单
       */
    initMenu() {
      request.http_mock('/api/menu').then(res => {
        this.menuData = res.data
        this.$router.push('/home')
        this.$nextTick(() => {
          this.active = '/home'
        })
      })
    },
    // 切换菜单
    handleMenu(data) {
      this.$router.push(data)
      this.active = data
    },
    // 收起左侧导航菜单
    collapsedSider() {
        this.$refs.side1.toggleCollapse();
    },
  }
}
</script>

<style lang='less'>
  .layout{
      height: 100%;
      background: #f5f7f9;
      position: relative;
      overflow: hidden;
  }
  .layout-header-bar{
      text-align: left;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo {
      width: 100%;
      height: 64px;
      background: #363e4f;
      color: #f5f7f9;
      text-align: center;
      line-height: 64px;
      font-size: 35px;
  }
  .layout-logo-left{
      width: 90%;
      height: 30px;
      background: #5b6270;
      border-radius: 3px;
      margin: 15px auto;
  }
  .menu-icon{
      transition: all .3s;
  }
  .rotate-icon{
      transform: rotate(-90deg);
  }
  .menu-item span{
      display: inline-block;
      overflow: hidden;
      width: 69px;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
      transition: width .2s ease .2s;
  }
  .menu-item i{
      transform: translateX(0px);
      transition: font-size .2s ease, transform .2s ease;
      vertical-align: middle;
      font-size: 16px;
  }
  .menu-item > .ivu-menu-item {
      text-align: left;
  }
  .collapsed-menu span{
      width: 0px;
      transition: width .2s ease;
  }
  .collapsed-menu i{
      transform: translateX(5px);
      transition: font-size .2s ease .2s, transform .2s ease .2s;
      vertical-align: middle;
      font-size: 22px;
  }
</style>
