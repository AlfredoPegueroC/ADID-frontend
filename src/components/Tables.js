"use client";
import Styles from "@styles/table.module.css";
import Image from 'next/image';
import Link from "next/link";

export default function Tables({ title, children }) {
  return (
    <table className={Styles.table_content}>
      {children}
    </table>

  )
}



