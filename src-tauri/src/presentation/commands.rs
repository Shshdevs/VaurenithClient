use crate::application;
use crate::domain::ClientInfo;

#[tauri::command]
pub fn get_client_info() -> ClientInfo {
    application::get_client_info()
}
