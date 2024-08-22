"use client";
import {
    ButtonBase,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import React, {useEffect, useState } from "react";
import { inspiredPalette } from "../ui/theme";
import { useRouter } from "next/navigation";

import {
    customReportPaths,
    memberReportPaths,
    adminReportPaths
} from "@/app/dashboard/drawer_config";

interface DrawerItem {
    title: string;
    destination: string;
    icon: any,
    selected: boolean;
};

const DrawerEntry = ({entry, onPress}:{entry: DrawerItem, onPress: (value: DrawerItem) => void}) => {
    return (
        <ButtonBase
        className="w-11/12 m-3 mb-3 flex flex-row align-middle justify-center"
        onClick={() => {
            onPress(entry);
        }}
        >
        <ListItem
        className={entry.selected ? "rounded-md" : ""}
        style={{
            backgroundColor: entry.selected ? "#FFFFFF" : "",
        }}
        >
        <ListItemIcon
        style={{
            color: entry.selected ? inspiredPalette.darker : "white",
        }}
        >
        {entry.icon}
        </ListItemIcon>
        <ListItemText
        style={{
            color: entry.selected ? inspiredPalette.darker : "white",
        }}
        primary={entry.title}
        />
        </ListItem>
        </ButtonBase>
    );
}

interface PathState {
    adminPaths: DrawerItem[];
    memberPaths: DrawerItem[];
    customPaths: DrawerItem[];
}

const DrawerList = ({userType, onRoute}: {userType: string, onRoute: () => void}) => {

    const router = useRouter();

    const [paths, setPaths] = useState<PathState>({
        adminPaths : userType === "Broker" ?  [adminReportPaths[0]] : adminReportPaths ?? [],
        memberPaths : memberReportPaths ?? [],
        customPaths : customReportPaths ?? [],
    });

    useEffect(() => {
        setPaths({
            adminPaths : userType === "Broker" ?  [adminReportPaths[0]] : adminReportPaths ?? [],
            memberPaths : memberReportPaths ?? [],
            customPaths : customReportPaths ?? [],
        })
    }, [userType]);



    const onClick = (entry: DrawerItem) => {
        let adminPaths = paths.adminPaths.map((value: DrawerItem) => {
            let selected = (value.title == entry.title);
            return {
                ...value,
                selected: selected
            }
        })
        let memberPaths = paths.memberPaths.map((value: DrawerItem) => {
            let selected = (value.title == entry.title);
            return {
                ...value,
                selected: selected
            }
        })
        let customPaths = paths.customPaths.map((value: DrawerItem) => {
            let selected = (value.title == entry.title);
            return {
                ...value,
                selected: selected
            }
        })

        setPaths({
            adminPaths : adminPaths,
            memberPaths : memberPaths,
            customPaths : customPaths,
        });

        router.push(entry.destination);
        onRoute();
    }
    return (
        <List className="h-full justify-center">
        {
            paths.adminPaths.map((path: DrawerItem, index: number) => {
                return (
                    <DrawerEntry
                    key={index}
                    entry={path}
                    onPress={(value: DrawerItem) => { onClick(value)}}
                    />
                );
            })
        }
        <Divider variant={"middle"}  component="li" sx={{
            background: 'white',
        }} />
        {
            paths.memberPaths.map((path: DrawerItem, index: number) => {
                return (
                    <DrawerEntry
                    key={index}
                    entry={path}
                    onPress={(value: DrawerItem) => { onClick(value)}}
                    />
                );
            })
        }
        <Divider variant={"middle"}  component="li" sx={{
            background: 'white',
        }} />
        {
            paths.customPaths.map((path: DrawerItem, index: number) => {
                return (
                    <DrawerEntry
                    key={index}
                    entry={path}
                    onPress={(value: DrawerItem) => { onClick(value)}}
                    />
                );
            })
        }
        </List>
    );
}

export { DrawerList };
