import Vue from 'vue'
import 
    {Button,
    Form,
    FormItem,
    Input,
    Card,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Row,
    Col,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Table,
    TableColumn,
    Dialog,
    Pagination,
    MessageBox,
    Tree,
    Tag,
    Select,
    Option,
    Radio,
    TimePicker,
    DatePicker,
    Loading 
    } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Card)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Select)
Vue.use(Option)
Vue.use(Radio)
Vue.use(TimePicker)
Vue.use(DatePicker)

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
