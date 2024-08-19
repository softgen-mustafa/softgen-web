"use client";
import { CardView } from "@/app/ui/responsive_grid";
import {
  Grid,
} from "@mui/material";
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
        weight: Weight.Medium,
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
        weight: Weight.Low,
        view: (<CardView className="w-400 min-h-400 bg-yellow-800"><h1>Card 8</h1></CardView>),
    },
    {
        weight: Weight.Medium,
        view: (<CardView className="w-400 min-h-400 bg-red-100"><h1>Card 9</h1></CardView>),
    },
    {
        weight: Weight.Low,
        view: (<CardView className="w-400 min-h-400 bg-blue-100"><h1>Card 10</h1></CardView>),
    },
    {
        weight: Weight.Low,
        view: (<CardView className="w-400 min-h-400 bg-blue-100"><h1>Card 11</h1></CardView>),
    },
    {
        weight: Weight.Low,
        view: (<CardView className="w-400 min-h-400 bg-blue-100"><h1>Card 12</h1></CardView>),
    }
];

const Page = () => {

  const [dimensions, setDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
    
  useEffect(() => {
    const handleResize = () => {
        setDimensions({width: window.innerWidth, height: window.innerHeight})
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const minWidth = 360;


    let col = Math.abs(Math.ceil((minWidth * 12) / dimensions.width));

    let currentCol = useRef(12);

    return <div>
    <br/>
    <br/>
    <br/>
    <h1>width: {dimensions.width}, height: {dimensions.height}</h1>
    <h1>col: {col}</h1>
    <h1>sample: {Math.floor(dimensions.width / minWidth)}</h1>
    <Grid container className="w-full h-full" spacing={2} >
    {
        views.map((entry: any, index: number) => {
            let nextWeight = (index + 1) >= views.length ? 0 : views[index + 1].weight;
            let gridCol = col * entry.weight;
            if (currentCol.current - gridCol < 0) {
                currentCol.current = 12;
            }
            if ((col * nextWeight) + gridCol > currentCol.current) {
                gridCol = currentCol.current;
            } else {
                currentCol.current -= gridCol;
            }
            return (
                <Grid
                item
                
                justifyContent={"center"}
                xs={12}
                sm={gridCol}
                md={gridCol}
                lg={gridCol}
                xl={gridCol}
                key={index}
                >
                {
                    <div>
                        <h6>gridCol: {gridCol} | nextCol: {col * nextWeight}</h6>
                        {
                            entry.view 
                        }
                    </div>
                }
                </Grid>
            )
        }) 
    }
    </Grid> 
    </div>;
};
export default Page;
