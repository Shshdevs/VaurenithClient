mod application;
mod domain;
mod presentation;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            presentation::commands::get_client_info
        ])
        .run(tauri::generate_context!())
        .expect("failed to run Vaurenith desktop application");
}
