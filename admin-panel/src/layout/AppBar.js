import * as React from 'react';
import { forwardRef } from 'react';
import { AppBar, UserMenu, MenuItemLink, useTranslate } from 'react-admin';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import { makeStyles } from '@mui/styles';
import { ToggleThemeButton,Configuration } from '@/components';
import Logo from './Logo';

const useStyles = makeStyles({
    title: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    spacer: {
        flex: 1,
    },
});

const ConfigurationMenu = forwardRef((props, ref) => {
    const translate = useTranslate();
    return (
        <MenuItemLink
            ref={ref}
            to="/configuration"
            // primaryText={translate('pos.configuration')}
            leftIcon={<SettingsIcon />}
            onClick={props.onClick}
            sidebarIsOpen
        />

    );
});

const CustomUserMenu = (props) => (
    <UserMenu {...props}>
        <ConfigurationMenu />
        <Configuration />
    </UserMenu>
);

const CustomAppBar = (props) => {
    const classes = useStyles();
    return (
        <AppBar {...props} elevation={1} userMenu={<CustomUserMenu />}>
            {/*<Typography*/}
                {/*variant="h6"*/}
                {/*color="inherit"*/}
                {/*className={classes.title}*/}
                {/*id="react-admin-title"*/}
            {/*/>*/}
            {/*<Logo />*/}
            <span className={classes.spacer} />
            {/**/}
            <ToggleThemeButton />

        </AppBar>
    );
};

export default CustomAppBar;
