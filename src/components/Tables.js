"use client";
import Styles from "@styles/table.module.css";


export default function Tables({ title, children }) {
  return (
    <table className={Styles.table_content}>
      {children}
    </table>

  )
}



