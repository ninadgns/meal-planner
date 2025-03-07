import requests
import time

# Telegram bot details
TELEGRAM_BOT_TOKEN = "7999731769:AAGr2OrqZIgEIUV0HJ5xoc5xJYCAlp-qFf0"  # Replace with your bot token
CHAT_ID = "499742795"  # Replace with your chat ID

# Define function to send messages to Telegram
def send_telegram_message(message):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    data = {"chat_id": CHAT_ID, "text": message}
    requests.post(url, data=data)

# Define function to check for new messages
def get_latest_message():
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates"
    response = requests.get(url).json()

    if "result" in response and response["result"]:
        last_message = response["result"][-1]  # Get the last message
        message_id = last_message["message"]["message_id"]
        message_text = last_message["message"]["text"].strip().lower()
        return message_id, message_text  # Return message ID and text
    return None, None

# Define the URL
url = "https://cmc.du.ac.bd/ajax/get_program_by_exam.php"

# Define headers
headers = {
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://cmc.du.ac.bd",
    "Referer": "https://cmc.du.ac.bd/result.php",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"'
}

# Define cookies
cookies = {
    "_ga": "GA1.3.1206235342.1731316401",
    "_ga_J1DQF09WZC": "GS1.3.1738526241.2.1.1738526828.0.0.0",
    "PHPSESSID": "6ntg5nj0498qdf5ntsl81p7jrn"
}

# Define constant form data (except exam_id)
base_data = {
    "reg_no": "10697",
    "pro_id": "1",
    "sess_id": "22",
    "gdata": "1"
}

# Define range of exam_id to brute-force
exam_id_start = 1120  # Modify as needed
exam_id_end = 1500    # Modify as needed

# String to search for
target_string = "Jannatul Ferdous Jannat"

# Counter for while-loop iterations
loop_count = 0
last_message_id = None  # Track last processed message ID

send_telegram_message("Chalano shuru holo")

# Infinite loop to check every 5 minutes
while True:
    loop_count += 1  # Increment loop count

    print(f"🔄 Starting loop iteration {loop_count}...")

    for exam_id in range(exam_id_start, exam_id_end + 1):
        data = base_data.copy()
        data["exam_id"] = str(exam_id)

        response = requests.post(url, headers=headers, cookies=cookies, data=data)

        if target_string in response.text:
            msg = f"Match found! Exam ID: {exam_id}\nResponse: {response.text}"
            send_telegram_message(msg)
            print(msg)

    # Check for new "check" message from user
    new_message_id, user_message = get_latest_message()
    if user_message == "check" and new_message_id != last_message_id:
        send_telegram_message(f"🔄 The script has run {loop_count} full cycles so far.")
        last_message_id = new_message_id  # Update last processed message ID

    print(f"✅ Loop {loop_count} complete. Waiting 5 minutes before re-running...\n")
    time.sleep(300)  # Wait for 5 minutes before the next check
