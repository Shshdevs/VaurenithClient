use crate::domain::ClientInfo;

pub fn get_client_info() -> ClientInfo {
    ClientInfo {
        app_name: "Vaurenith".into(),
        app_version: env!("CARGO_PKG_VERSION").into(),
        environment: "desktop".into(),
        operating_system: std::env::consts::OS.into(),
    }
}

#[cfg(test)]
mod tests {
    use super::get_client_info;

    #[test]
    fn client_info_contains_desktop_runtime_details() {
        let info = get_client_info();

        assert_eq!(info.app_name, "Vaurenith");
        assert!(!info.app_version.is_empty());
        assert_eq!(info.environment, "desktop");
        assert_eq!(info.operating_system, std::env::consts::OS);
    }

    #[test]
    fn client_info_uses_camel_case_ipc_fields() {
        let payload =
            serde_json::to_value(get_client_info()).expect("client info should serialize");

        assert!(payload.get("appName").is_some());
        assert!(payload.get("appVersion").is_some());
        assert!(payload.get("operatingSystem").is_some());
    }
}
