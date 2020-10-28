import React from 'react';
import { Tooltip, Zoom, Typography, Box, CircularProgress } from './Material';
const CTooltip = (props) => (
    <Tooltip title={
        <>
            <Typography>{props.title}</Typography>
        </>
    } TransitionComponent={Zoom}>
        {props.children}
    </Tooltip>
);

function CircularProgressWithLabel(props) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="static" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

function CircularLabelProgress(props) {
    return <CircularProgressWithLabel value={props.value} />;
}

export { CTooltip, CircularLabelProgress };
