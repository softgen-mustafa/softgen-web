"use client"

import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services"
import { DateRangePicker } from "@/app/ui/date_ui"
import { useSnackbar } from "@/app/ui/snack_bar_provider"
import { Cancel, Sync } from "@mui/icons-material"
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, CircularProgress, IconButton, Typography, useTheme } from "@mui/material"
import { GridExpandMoreIcon } from "@mui/x-data-grid"
import { useEffect, useState, useRef } from "react"

const CollectionPrompts = () => {
    const snackbar = useSnackbar();
    const theme = useTheme()
    const [prompts, setPrompts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    let dateRange = useRef({
        startDate: "01-01-2024",
        endDate: "01-01-2025"
    });

    useEffect(() => {
        loadPrompts()
    }, [])

    const loadPrompts = async () => {
        try {
            setLoading(true)
            let url = `${getSgBizBaseUrl()}/prompts/get/collection`
            let requestBody = {
                "StartDateStr": dateRange.current.startDate,
                "EndDateStr": dateRange.current.endDate,
                "Filter": {
                    "Batch": {
                        "Apply": true,
                        "Limit": 30,
                        "Offset": 0
                    }
                }
            }
            let response = await postAsync(url, requestBody)
            if (response && response.Data && response.Data.length > 0) {
                setPrompts(response.Data)
                return
            }
                setPrompts([])

        } catch {
            snackbar.showSnackbar("Could not load collection prompts", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-auto max-h-[500px] overflow-y-auto">
        {
            loading
            &&
                <CircularProgress />
        }

        <div className="flex flex-row justify-between">
        {/*
        <DateRangePicker 
            onDateChange={(fromDate?: string, toDate?:string) => {
                if (fromDate != null) {
                    dateRange.current.startDate = fromDate
                }
                if (toDate != null) {
                    dateRange.current.endDate = toDate
                }
                loadPrompts()
            }}
        /> */}
            <IconButton onClick={() => {
                loadPrompts()
            }}>
                <Sync/>
            </IconButton>
        </div>
        {

            prompts.map((entry: any, index: number) => {
                return (
                    <div key={index} className="flex flex-col p-1" style={{
                    }}>
                        <Accordion className="h-auto mb-4">
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                >
                                <Typography className="text-md mb-4">{entry.Message}</Typography>
                            </AccordionSummary>
                            <AccordionDetails className="h-auto">
                                <Typography
                                style={{
                                    whiteSpace: 'pre-line', // This preserves line breaks from \n
                                }}
                                >{entry.SummaryProfile}</Typography>
                            </AccordionDetails>
                            <AccordionActions>
                                {
                                    entry.Actions
                                    &&
                                    entry.Actions.map((action: any, actionIndex: number) => {
                                        if (action.Title === "Ignore") {
                                            return (
                                                <IconButton size="medium">
                                                    <Cancel/>
                                                </IconButton>
                                            )
                                        }
                                        return (
                                            <Button style={{
                                                background: theme.palette.primary.dark,
                                            }} className="m-2 flex flex-grow" variant="contained" key={actionIndex}>{action.Title}</Button>
                                        );
                                    })
                                }
                            </AccordionActions>
                        </Accordion>
                        {
                            entry.Suggestion
                            &&
                            <Typography>{entry.Suggestion}</Typography>
                        }
                    </div>
                )
            })
        }
        </div>
    )
}

export {CollectionPrompts};
