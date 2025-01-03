'use client'

import Link from "next/link"
import clsx from "clsx"
import React from "react";

interface MobileItemProps {
    icon: any;
    active?: boolean;
    href: string;
    onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps>= ({icon: Icon, active, href, onClick}) =>{

    const handleClick = () => {
        if(onClick){
            return onClick();
        }
    }

    return(
        <Link 
            onClick={handleClick}
            href={href}
            className={clsx("group flex text-3xl leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100 ", active && "bg-gray-100 text-black")}
        >
            <Icon className="h-6 w-6" />
        </Link>
    )
}

export default MobileItem