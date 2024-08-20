"use client";
import { CardView } from "@/app/ui/responsive_grid";
import {
    Grid,
} from "@mui/material";
import { setEngine } from "crypto";
import { useState, useEffect, useRef } from "react";

const Weight = {
    High: 3,
    Medium: 2,
    Low: 1,
}

const views: any[] = [
    {
        weight: Weight.Low,
        view: (<CardView className="w-400 min-h-400 bg-red-400"><h1>Card 1</h1></CardView>),
    },
        {
            weight: Weight.Medium,
            view: (<CardView className="w-400 min-h-400 bg-blue-400"><h1>Card 2</h1></CardView>),
        },
            {
                weight: Weight.Low,
                view: (<CardView className="w-400 min-h-400 bg-green-400"><h1>Card 3</h1></CardView>),
            },
                {
                    weight: Weight.Low,
                    view: (<CardView className="w-400 min-h-400 bg-yellow-400"><h1>Card 4</h1></CardView>),
                },
                    {
                        weight: Weight.High,
                        view: (<CardView className="w-400 min-h-400 bg-red-800"><h1>Card 5</h1></CardView>),
                    },
                        {
                            weight: Weight.Low,
                            view: (<CardView className="w-400 min-h-400 bg-blue-800"><h1>Card 6</h1></CardView>),
                        },
                            {
                                weight: Weight.High,
                                view: (<CardView className="w-400 min-h-400 bg-green-800"><h1>Card 7</h1></CardView>),
                            },
                                {
                                    weight: Weight.High,
                                    view: (<CardView className="w-400 min-h-400 bg-yellow-800"><h1>Card 8</h1></CardView>),
                                },
                                    {
                                        weight: Weight.High,
                                        view: (<CardView className="w-400 min-h-400 bg-red-100"><h1>Card 9</h1></CardView>),
                                    },
                                        {
                                            weight: Weight.Low,
                                            view: (<CardView className="w-400 min-h-400 bg-blue-100"><h1>Card 10</h1></CardView>),
                                        },
                                            {
                                                weight: Weight.Low,
                                                view: (<CardView className="w-400 min-h-400 bg-blue-100"><h1 >Card 11</h1></CardView>),
                                            },
                                                {
                                                    weight: Weight.High,
                                                    view: (<CardView className="w-400 min-h-400 bg-blue-100"><h1>Card 12</h1></CardView>),
                                                }
];

const Page = () => {
    const minWidth = 360;
    return <div>
    <br/>
    <br/>
    <br/>
    <div className="p-2 w-full flex flex-row flex-wrap gap-4 justify-stretch" >
        {
            views.map((entry: any, index: number) => {
                return (
                    <div className={"flex-grow"} key={index} style={{
                        minWidth: minWidth,
                        minHeight: 200,
                        maxHeight: 600,
                        flexGrow: entry.weight
                    }}>
                    <h3>flex-grow: {entry.weight}</h3>
                    {
                        entry.view
                    }
                    </div>
                )
            })
        }
    </div>
    </div>;
};
export default Page;
