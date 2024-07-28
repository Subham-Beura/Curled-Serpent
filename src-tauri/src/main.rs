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
#[tauri::command]
fn post_request(url: &str, data: &str) -> String {
    println!("POST {} Data: {}", url, data);
    let json = serde_json::from_str::<serde_json::Value>(data).unwrap();
    println!("{:?}", json);
    println!("{}", format!("-d '{}'", data));
    let output = Command::new("curl")
        .args(["-H", "Content-Type:application/json"])
        .args(["-d", &format!("{}", data)])
        .arg(url)
        .output()
        .expect("Failed to execute command");
    let res: String = String::from_utf8_lossy(&output.stdout).to_string();
    // println!("{}", res);
    return res;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_request, post_request])
        // .invoke_handler(tauri::generate_handler![post_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
