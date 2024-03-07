import MenuLinks from "./menuLinks/menuLinks";
import styles from "./sidebar.module.css";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdLogout,
} from "react-icons/md";
import { TbReorder } from "react-icons/tb";
import { TiTickOutline } from "react-icons/ti";
import { IoIosPaper } from "react-icons/io";

import { auth, signOut } from "@/app/auth";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
        adminOnly:true,
      },
      {
        title: "Sales Representative ",
        path: "/dashboard/sales",
        icon: <MdSupervisedUserCircle />,
        adminOnly:true,
      },
      {
        title: "Clients",
        path: "/dashboard/clients",
        icon: <MdPeople/>,
      },
      {
        title: "Suppliers",
        path: "/dashboard/suppliers",
        icon: <MdWork />,
        adminOnly: true,

      },
      {
        title: "Quotations",
        path: "/dashboard/quotations",
        icon: <IoIosPaper  />,

      },
      {
        title: "Approve",
        path: "/dashboard/approve",
        icon: <TiTickOutline />,
        adminOnly: true,
      },
      {
        title: "PurchaseOrders",
        path: "/dashboard/purchaseOrder",
        icon: <MdShoppingBag />,
        adminOnly:true,

      },
      {
        title: "Job Order",
        path: "/dashboard/jobOrder",
        icon: <TbReorder />,
        adminOnly:true,


      },
      {
        title: "PL&CoC",
        path: "/dashboard/pl_coc",
        icon: <MdAttachMoney />,


      },
      
    ],
  },
  {
    title: "Analytics",
    list: [
    
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: <MdAnalytics />,
      },

    ],
  },
 
];
const Sidebar = async () => {
  const { user } = await auth();
  const isAdmin = user && user.isAdmin;
  const isUserOnly = user && user.isUserOnly;
  
  const filteredMenuItems = menuItems.map((cat) => ({
    title: cat.title,
    list: cat.list.filter((item) => {
      // Check if the user is an admin or the item is not marked as adminOnly
      const isAdminOrNotAdminOnly = isAdmin || !item.adminOnly;
  
      // Check if the user is not an admin or the item is not marked as userOnly
      const isUserOrNotUserOnly = !isAdmin || !item.userOnly;
  
      // Combine both conditions to filter items accordingly
      return isAdminOrNotAdminOnly && isUserOrNotUserOnly;
    }),
  }));
  

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <img src={user.img || "/noavatar.png"} alt="" width='50' height='50' className={styles.userImage} />
        <div className={styles.userDetail}>
          <span className={styles.userName}>{user.username}</span>
          <span className={styles.userTitle}></span>

        </div>
      </div>
      
      <ul className={styles.list}>
        {filteredMenuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLinks item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <form action={ async() => {
        "use server"
        await signOut();
      }}>
      <button className={styles.logout}><MdLogout/> Logout</button>
      </form>
    </div>
  );
};

export default Sidebar