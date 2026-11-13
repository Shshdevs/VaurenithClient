use serde::Serialize;

#[derive(Debug, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ClientInfo {
    pub app_name: String,
    pub app_version: String,
    pub environment: String,
    pub operating_system: String,
}
