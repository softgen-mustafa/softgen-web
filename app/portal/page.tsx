"use client";
import { useEffect, useState } from "react";

const cosmicWeights = {
    Nebula: 3,
    Planet: 2,
    Comet: 1,
    Earthly: 0,
}

interface CommonCardProps {
    weight?: number,
}

const CommonCard = ({
    weight = cosmicWeights.Earthly,
}: CommonCardProps) => {

    const [mass, setMass] = useState<string>("basis-1/2");

    useEffect(() => {
        const handleResize = () => {
            getBasisForWeight();
        };

        // Set initial mass based on the weight
        getBasisForWeight();

        // Add resize event listener
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [weight]);

    const getBasisForWeight = () => {
        let defaultMass = "basis-1/2";
        switch (weight) {
            case cosmicWeights.Nebula:
                defaultMass = "basis-1/2";
                break;
            case cosmicWeights.Planet:
                defaultMass = "basis-1/3";
                break;
            case cosmicWeights.Comet:
                defaultMass = "basis-1/5";
                break;
            default:
                defaultMass = "basis-1/2";
                break;
        }

        // Check window width and adjust class
        const windowWidth = window.innerWidth;
        if (windowWidth < 640) {
            setMass("basis-full");
        } else {
            setMass(defaultMass);
        }

    };

    return (
        <div className={`bg-red-800 ${mass} flex-grow`} style={{
            minHeight: 400,
            maxHeight: 600,
        }}>
            Card with {mass} 
        </div>
    );
};

const views = [
    { view: (<CommonCard weight={cosmicWeights.Earthly}/>), },
    { view: (<CommonCard weight={cosmicWeights.Earthly}/>), },
    { view: (<CommonCard weight={cosmicWeights.Comet}/>), },
    { view: (<CommonCard weight={cosmicWeights.Nebula}/>), },
    { view: (<CommonCard  weight={cosmicWeights.Comet}/>), },
    { view: (<CommonCard weight={cosmicWeights.Comet}/>), },
    { view: (<CommonCard  weight={cosmicWeights.Planet}/>), },
    { view: (<CommonCard weight={cosmicWeights.Comet}/>), },
    { view: (<CommonCard  weight={cosmicWeights.Planet}/>), },
    { view: (<CommonCard  weight={cosmicWeights.Nebula}/>), },
    { view: (<CommonCard  weight={cosmicWeights.Nebula}/>), },
];

interface CosmicLayoutProps {
    views: any[]
}

const CosmicLayout = ({ views }: CosmicLayoutProps) => {
    return (
        <div className="bg-red-300 w-full h-full flex flex-row flex-wrap gap-4 justify-stretch">
            {views.map((entry: any) => {
                return entry.view;
            })}
        </div>
    );
};

const Page = () => {
    return (
        <div className="w-full h-[100vh] p-1">
            <CosmicLayout views={views} />
        </div>
    );
};

export default Page;

