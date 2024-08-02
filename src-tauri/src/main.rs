// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::Serialize;
use std::collections::HashMap;
use std::process::Command;
#[derive(Debug, Serialize)]
struct ParsedResponse {
    status: String,
    headers: HashMap<String, String>,
    body: String,
}
#[derive(Debug, Serialize)]
struct ErrorResponse {
    error: String,
}
#[tauri::command]
fn get_request(url: &str, data: &str) -> String {
    println!("GET {} Data: {}", url, data);
    let output = Command::new("curl")
        .arg("-i")
        .args(["-X", "GET"])
        .args(["-H", "Content-Type:application/json"])
        .args(["-d", &format!("{}", data)])
        .arg(url)
        .output()
        .expect("Failed to execute command");

    let res: String = String::from_utf8_lossy(&output.stdout).to_string();

    let parsed_response = parse_http_response(&res);

    match parsed_response {
        Ok(parsed_response) => serde_json::to_string(&parsed_response),
        Err(e) => serde_json::to_string(&ErrorResponse {
            error: e.to_string(),
        }),
    }
    .unwrap_or_else(|e| format!("{{\"error\":\"JSON serialization failed: {}\"}}", e))
}
#[tauri::command]
fn post_request(url: &str, data: &str) -> String {
    println!("POST {} Data: {}", url, data);
    let output = Command::new("curl")
        .arg("-i")
        .args(["-X", "POST"])
        .args(["-H", "Content-Type:application/json"])
        .args(["-d", &format!("{}", data)])
        .arg(url)
        .output()
        .expect("Failed to execute command");
    let res: String = String::from_utf8_lossy(&output.stdout).to_string();

    let parsed_response = parse_http_response(&res);

    match parsed_response {
        Ok(parsed_response) => serde_json::to_string(&parsed_response),
        Err(e) => serde_json::to_string(&ErrorResponse {
            error: e.to_string(),
        }),
    }
    .unwrap_or_else(|e| format!("{{\"error\":\"JSON serialization failed: {}\"}}", e))
}

#[tauri::command]
fn put_request(url: &str, data: &str) -> String {
    println!("PUT {} Data: {}", url, data);
    let output = Command::new("curl")
        .arg("-i")
        .args(["-X", "PUT"])
        .args(["-H", "Content-Type:application/json"])
        .args(["-d", &format!("{}", data)])
        .arg(url)
        .output()
        .expect("Failed to execute command");
    let res: String = String::from_utf8_lossy(&output.stdout).to_string();

    let parsed_response = parse_http_response(&res);

    match parsed_response {
        Ok(parsed_response) => serde_json::to_string(&parsed_response),
        Err(e) => serde_json::to_string(&ErrorResponse {
            error: e.to_string(),
        }),
    }
    .unwrap_or_else(|e| format!("{{\"error\":\"JSON serialization failed: {}\"}}", e))
}
#[tauri::command]
fn delete_request(url: &str, data: &str) -> String {
    println!("DELETE {} Data: {}", url, data);
    let output = Command::new("curl")
        .arg("-i")
        .args(["-X", "DELETE"])
        .args(["-H", "Content-Type:application/json"])
        .args(["-d", &format!("{}", data)])
        .arg(url)
        .output()
        .expect("Failed to execute command");
    let res: String = String::from_utf8_lossy(&output.stdout).to_string();
    let parsed_response = parse_http_response(&res);

    match parsed_response {
        Ok(parsed_response) => serde_json::to_string(&parsed_response),
        Err(e) => serde_json::to_string(&ErrorResponse {
            error: e.to_string(),
        }),
    }
    .unwrap_or_else(|e| format!("{{\"error\":\"JSON serialization failed: {}\"}}", e))
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_request,
            post_request,
            put_request,
            delete_request
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
fn parse_http_response(response: &str) -> Result<ParsedResponse, Box<dyn std::error::Error>> {
    let mut lines = response.lines();

    // Parse status line
    let status_line = lines.next().ok_or("No status line")?;
    let status = status_line.to_string();

    // Parse headers
    let mut headers = HashMap::new();
    let mut body_start = 0;
    for (i, line) in lines.enumerate() {
        if line.is_empty() {
            body_start = i + 1;
            break;
        }
        let parts: Vec<&str> = line.splitn(2, ": ").collect();
        if parts.len() == 2 {
            headers.insert(parts[0].to_string(), parts[1].to_string());
        }
    }
    // Parse JSON body
    let body: String = response
        .lines()
        .skip(body_start)
        .collect::<Vec<&str>>()
        .join("\n");
    Ok(ParsedResponse {
        status,
        headers,
        body,
    })
}
