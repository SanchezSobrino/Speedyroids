#!/bin/bash

install-plugin () {
    local platform=$1
    local plugin=$2

    if [ $# -ge 2 ]; then
        local variables=""
        if [ $# -gt 2 ]; then
            shift 2
            variables="$@"
        fi

        case ${platform} in
        "all")
            if [ -d "./platforms/android" ]; then
                plugman install --platform android --project ./platforms/android --plugin ${plugin} ${variables}
            fi
            if [ -d "./platforms/ios" ]; then
                plugman install --platform ios --project ./platforms/ios --plugin ${plugin} ${variables}
            fi
            ;;
        *)
            plugman install --platform ${platform} --project ./platforms/${platform} --plugin ${plugin} ${variables}
            ;;
        esac
    fi
}

get-key-from-config-js () {
    local key=$1
    echo "$(sed -n "s/^.*${key}: '\(.*\)',/\1/p" js/src/config.js)"
}

install-common-plugins () {
    install-plugin all https://github.com/apache/cordova-plugin-device.git
    install-plugin all https://github.com/apache/cordova-plugin-network-information.git
    install-plugin all https://github.com/apache/cordova-plugin-vibration.git
    install-plugin all https://github.com/apache/cordova-plugin-globalization.git
    install-plugin all https://github.com/apache/cordova-plugin-inappbrowser.git
    install-plugin all https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git
    install-plugin all https://github.com/whiteoctober/cordova-plugin-app-version.git
}

install-android-plugins () {
    install-plugin android https://github.com/apache/cordova-plugin-whitelist.git
}

install-ios-plugins () {
    install-plugin ios https://github.com/apache/cordova-plugin-statusbar.git
    install-plugin ios https://github.com/apache/cordova-plugin-splashscreen.git
}

main () {
    if [ "$#" -ne 1 ]; then
        echo "Usage:"
        echo "  $0 [<android> | <ios>]"
        exit
    fi

    install-common-plugins
    if [ "$1" == "android" ]; then
        install-android-plugins
    elif [ "$1" == "ios" ]; then
        install-ios-plugins
    fi

    cordova prepare
}

main "$@"

