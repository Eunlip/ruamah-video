import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "org.opd.rumahvideo",
    appName: "Rumah Video",
    webDir: "out",
    server: {
        allowNavigation: [
            "drive.google.com",
            "*.google.com",
            "*.googleapis.com",
            "*.googleusercontent.com"
        ]
    },
    plugins: {
        CapacitorHttp: {
            enabled: true,
        },
    },
};

export default config;
