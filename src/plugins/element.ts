import Vue from "vue";
import {
  Button,
  ButtonGroup,
  Aside,
  Container,
  Main,
  Menu,
  MenuItem,
  Tooltip,
  Col,
  Row,
  Submenu,
  MenuItemGroup,
  Card,
  Image,
  Drawer,
  Dialog,
  Form,
  FormItem,
  Input,
  Switch,
  Select,
  Option,
  Avatar,
  Tag,
  Table,
  TableColumn,
  Badge,
  Popover,
  Timeline,
  TimelineItem,
  Link,
  PageHeader,
  Breadcrumb,
  BreadcrumbItem,
  Loading,
  Message,
  MessageBox,
  Notification
} from "element-ui";
// @ts-ignore
import lang from "element-ui/lib/locale/lang/en";
// @ts-ignore
import locale from "element-ui/lib/locale";

locale.use(lang);

const components = [
  Button,
  ButtonGroup,
  Aside,
  Container,
  Main,
  Menu,
  MenuItem,
  Tooltip,
  Col,
  Row,
  Submenu,
  MenuItemGroup,
  Card,
  Image,
  Drawer,
  Dialog,
  Form,
  FormItem,
  Input,
  Switch,
  Select,
  Option,
  Avatar,
  Tag,
  Table,
  TableColumn,
  Badge,
  Popover,
  Timeline,
  TimelineItem,
  Link,
  PageHeader,
  Breadcrumb,
  BreadcrumbItem,
  Loading
];

components.forEach(component => Vue.use(component));

Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
