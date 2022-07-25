import {useState} from "react";
import { useMediaQuery } from "@mui/material";
import { MenuItemLink, useResourceDefinitions, useSidebarState, useTranslate } from "react-admin";
import {Dashboard,MoreHoriz} from '@mui/icons-material';
import SubMenu from './SubMenu';
import resources from '@/resource/index';
const { Action,Attributes,Category,Customer,MainDashboard,Media,Order,OrderCart,Post,Product,Settings,Sms,Transaction,User } = resources;

const Menu = ({ onMenuClick,dense = false  }) => {

  const [state, setState] = useState({
    menuProduct: false,
    menuSection: false,


    menuOrder:false,
    menuCustomer: false,
    menuUser: false,

    menuSms:false,
    menuPost:false,
    menuMore:false,

  });
  const isXSmall = useMediaQuery(theme => theme.breakpoints.down("xs"));
  const [open] = useSidebarState();
  const resources = useResourceDefinitions();
  const translate = useTranslate();
  const handleToggle = (menu) => {
    setState(state => ({ ...state, [menu]: !state[menu] }));
  };
  // console.log("resources", resources);
  return (
    <div>
      {/*{Object.keys(resources).map(name => (*/}
      {/*<MenuItemLink*/}
      {/*key={name}*/}
      {/*to={`/${name}`}*/}
      {/*primaryText={resources[name].options && resources[name].options.label || name}*/}
      {/*leftIcon={createElement(resources[name].icon)}*/}
      {/*onClick={onMenuClick}*/}
      {/*sidebarIsOpen={open}*/}
      {/*/>*/}
      {/*))}*/}
      {/*<MenuItemLink*/}
      {/*to="/custom-route"*/}
      {/*primaryText="Miscellaneous"*/}
      {/*leftIcon={<LabelIcon />}*/}
      {/*onClick={onMenuClick}*/}
      {/*sidebarIsOpen={open}*/}
      {/*/>*/}
      <MenuItemLink
        to={"/"}
        primaryText={translate(`pos.menu.dashboard`)}
        leftIcon={<Dashboard/>}
        exact={"true"}
        dense={dense}
        className={"vas"}
      />
      <SubMenu
        handleToggle={() => handleToggle("menuSection")}
        isOpen={state.menuSection}
        name="sections"
        label={translate("pos.menu.sections")}
        icon={<Attributes.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/attributes/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.addAttribute`)}
          leftIcon={<Attributes.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/attributes",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allAttributes`)}
          leftIcon={<Attributes.icon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/category/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.addCategory`)}
          leftIcon={<Category.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/category",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allCategories`)}
          leftIcon={<Category.icon/>}
          dense={dense}
        />

          <MenuItemLink
          to={{
            pathname: "/menu/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.addMenu`)}
          leftIcon={<Category.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/menu",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allMenus`)}
          leftIcon={<Category.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuMedia")}
        isOpen={state.menuMedia}
        name="media"
        label={translate(`pos.menu.medias`)}
        icon={<Media.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/media/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.addMedia`)}
          leftIcon={<Media.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/media",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allMedias`)}
          leftIcon={<Media.icon/>}
          dense={dense}
        />

      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuProduct")}
        isOpen={state.menuProduct}
        name="product"
        label={translate(`pos.menu.products`)}
        icon={<Product.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/product/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.addProduct`)}
          leftIcon={<Product.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/product",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allProducts`)}
          leftIcon={<Product.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuOrder")}
        isOpen={state.menuOrder}
        name="order"
        label={translate(`pos.menu.orders`)}
        icon={<Order.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/order",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allOrders`)}
          leftIcon={<Order.icon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/ordercart",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.cart`)}
          leftIcon={<OrderCart.icon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/order/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.addOrder`)}
          leftIcon={<OrderCart.icon/>}
          dense={dense}
        />

      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuTransaction")}
        isOpen={state.menuTransaction}
        name="transaction"
        label={translate(`pos.menu.transactions`)}
        icon={<Transaction.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/transaction",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allTransactions`)}
          leftIcon={<Transaction.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuCustomer")}
        isOpen={state.menuCustomer}
        name="customer"
        label={translate(`pos.menu.customers`)}
        icon={<Customer.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/customer/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.addCustomer`)}
          leftIcon={<Customer.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/customer",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allCustomers`)}
          leftIcon={<Customer.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuUser")}
        isOpen={state.menuUser}
        name="users"
        label={translate(`pos.menu.users`)}
        icon={<User.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/user/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.addUser`)}
          leftIcon={<User.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/user",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allUsers`)}
          leftIcon={<User.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuSms")}
        isOpen={state.menuSms}
        name="sms"
        label={translate(`pos.menu.sms`)}
        icon={<Sms.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/sms/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.sendSms`)}
          leftIcon={<Sms.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/sms",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allSms`)}
          leftIcon={<Sms.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuPost")}
        isOpen={state.menuPost}
        name="sms"
        label={translate(`pos.menu.post`)}
        icon={<Post.icon/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/post/create",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.createPost`)}
          leftIcon={<Post.createIcon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/post",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.allPost`)}
          leftIcon={<Post.icon/>}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("menuMore")}
        isOpen={state.menuMore}
        name="more"
        label={translate(`pos.menu.more`)}
        icon={<MoreHoriz/>}
        dense={dense}
      >
        <MenuItemLink
          to={{
            pathname: "/action",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.siteActions`)}
          leftIcon={<Action.icon/>}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: "/settings",
            state: { _scrollToTop: true }
          }}
          primaryText={translate(`pos.menu.siteSettings`)}
          leftIcon={<Settings.icon/>}
          dense={dense}
        />
      </SubMenu>
    </div>
  );
};

export default Menu;