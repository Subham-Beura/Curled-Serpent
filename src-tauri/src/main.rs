// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

#[tauri::command]
fn get_request(url: &str) -> String {
    println!("GET {}", url);
    let output = Command::new("curl")
        .arg(url)
        .output()
        .expect("Failed to execute command");

    let res: String = String::from_utf8_lossy(&output.stdout).to_string();

    return res;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
