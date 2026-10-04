# How VTOP College Data is Collected (Reverse Engineering Spec)

This document breaks down how data is fetched from the college portal (VTOP) using username and password, with the technical details needed to recreate the process in Python, Node.js, Go, or any other language.

---

## 1. High-Level Concept

VTOP does **not** have a public REST API. The app works by running an internal headless web session (**Android WebView**) that mimics a real web browser:
1. It navigates to the portal login page.
2. It fetches the captcha image and prompts the user to solve it.
3. It submits credentials (`username`, `password`, and `captcha`) to `/vtop/login`.
4. It extracts session cookies and hidden CSRF tokens (`_csrf`, `authorizedIDX`).
5. It performs sequential HTTP POST requests to the portal's internal endpoints with form-encoded data.
6. It parses the returned HTML tables into structured JSON.

---

## 2. Authentication Workflow

### Step 1: Prelogin Handshake
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/prelogin/setup`
* **Form Data:** Form values serialized from the student landing page form (`#stdForm`).
* **Purpose:** Initializes cookies and sets up the server-side login context.

### Step 2: Fetch Captcha
* **URL:** `https://vtopcc.vit.ac.in/vtop/login`
* **DOM Selector:** `$('#captchaBlock img').attr('src')`
* The image source is a Base64 data URL: `data:image/png;base64,<BASE64_STRING>`.
* In another language: Decode this Base64 string to an image file or display/OCR it to get the captcha string.

### Step 3: Login POST Request
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/login`
* **Content-Type:** `application/x-www-form-urlencoded`
* **Form Body:**
  ```text
  username=<REG_NO>&password=<PASSWORD>&captchaStr=<CAPTCHA_TEXT>&gResponse=<CAPTCHA_TEXT>
  ```
* **Success Indicator:** The response HTML contains the element with `id="authorizedIDX"`.
* **Tokens Extracted from Response:**
  * `authorizedID`: Value of input `#authorizedIDX`
  * `_csrf`: Value of input `input[name="_csrf"]`
  * Session Cookies: `CookieManager` session cookies (`JSESSIONID`, etc.).

---

## 3. Endpoints & Data Collection

Every subsequent call requires:
* The session cookiejar from the login step.
* Header: `User-Agent: <standard_desktop_browser_user_agent>`
* Body parameters: `authorizedID=<authorizedIDX>&_csrf=<CSRF_TOKEN>`

### 1. Semester List
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/academics/common/StudentTimeTableChn`
* **Payload:** `verifyMenu=true&authorizedID=<AUTH_ID>&_csrf=<CSRF>&nocache=<TIMESTAMP>`
* **Parsing:** Parse dropdown `<select id="semesterSubId">`.
  * `<option value="CH2020211">Fall Semester 2020-21</option>` $\rightarrow$ extract `semesterSubId`.

### 2. Profile (Student Name)
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/studentsRecord/StudentProfileAllView`
* **Payload:** `verifyMenu=true&authorizedID=<AUTH_ID>&_csrf=<CSRF>&nocache=<TIMESTAMP>`
* **Parsing:** Find table cell `<td>` containing `"student"` and `"name"`, read the following `<td>`.

### 3. CGPA & Total Credits
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/examinations/examGradeView/StudentGradeHistory`
* **Payload:** `verifyMenu=true&authorizedID=<AUTH_ID>&_csrf=<CSRF>&nocache=<TIMESTAMP>`
* **Parsing:** HTML table footer with headings `"earned credits"` and `"cgpa"`.

### 4. Registered Courses & Slots
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/processViewTimeTable`
* **Payload:** `_csrf=<CSRF>&semesterSubId=<SEMESTER_ID>&authorizedID=<AUTH_ID>`
* **Parsing:** Table inside `#studentDetailsList`.
  * Extracts: Course Code, Course Title, Course Type (`Theory` / `Lab` / `Project`), Credits, Slots (e.g., `L45+L46`), Classroom Venue, Faculty Name.

### 5. Timetable Schedule
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/processViewTimeTable`
* **Payload:** `_csrf=<CSRF>&semesterSubId=<SEMESTER_ID>&authorizedID=<AUTH_ID>`
* **Parsing:** Table `#timeTableStyle`.
  * Parses daily time grid (Monday to Sunday) mapping slot names (`A1`, `B1`, etc.) to specific start and end times.

### 6. Attendance
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/processViewStudentAttendance`
* **Payload:** `_csrf=<CSRF>&semesterSubId=<SEMESTER_ID>&authorizedID=<AUTH_ID>`
* **Parsing:** Table inside `#getStudentDetails`.
  * Columns: Course Type, Slot, Attended Hours, Total Hours, Percentage.

### 7. Marks
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/examinations/doStudentMarkView`
* **Payload:** `semesterSubId=<SEMESTER_ID>&authorizedID=<AUTH_ID>&_csrf=<CSRF>`
* **Parsing:** Table `#fixedTableContainer`.
  * Rows contain nested tables for CAT-1, CAT-2, DA, Quizzes: Scored Mark, Max Mark, Weightage %, Class Average, Status.

### 8. Exam Schedule
* **URL:** `POST https://vtopcc.vit.ac.in/vtop/examinations/doSearchExamScheduleForStudent`
* **Payload:** `semesterSubId=<SEMESTER_ID>&authorizedID=<AUTH_ID>&_csrf=<CSRF>`
* **Parsing:** Exam schedule table.
  * Columns: Slot, Date, Timing, Venue, Seat Location, Seat Number.

### 9. Proctor & Faculty Info
* **Proctor URL:** `POST https://vtopcc.vit.ac.in/vtop/proctor/viewProctorDetails`
  * **Payload:** `verifyMenu=true&winImage=<VAL>&authorizedID=<AUTH_ID>&_csrf=<CSRF>&nocache=<TIMESTAMP>`
* **Dean & HOD URL:** `POST https://vtopcc.vit.ac.in/vtop/hrms/viewHodDeanDetails`

---

## 4. Recipe to Recreate in Python (Quick Example)

```python
import requests
from bs4 import BeautifulSoup
import base64

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
})

BASE_URL = "https://vtopcc.vit.ac.in/vtop"

# 1. Open login page
res = session.get(f"{BASE_URL}/login")
soup = BeautifulSoup(res.text, "html.parser")

# 2. Get Captcha (Base64)
captcha_img = soup.select_one("#captchaBlock img")["src"]
b64_data = captcha_img.split(",")[1]
with open("captcha.png", "wb") as f:
    f.write(base64.b64decode(b64_data))

captcha_val = input("Enter captcha from captcha.png: ")

# 3. Post Login
login_data = {
    "username": "YOUR_REG_NO",
    "password": "YOUR_PASSWORD",
    "captchaStr": captcha_val,
    "gResponse": captcha_val
}
res_login = session.post(f"{BASE_URL}/login", data=login_data)
soup_login = BeautifulSoup(res_login.text, "html.parser")

auth_id = soup_login.find("input", {"id": "authorizedIDX"})["value"]
csrf_token = soup_login.find("input", {"name": "_csrf"})["value"]

# 4. Fetch Attendance (or any other endpoint)
att_data = {
    "_csrf": csrf_token,
    "authorizedID": auth_id,
    "semesterSubId": "CH2020211"  # replace with current semester ID
}
att_res = session.post(f"{BASE_URL}/processViewStudentAttendance", data=att_data)
# Parse att_res.text using BeautifulSoup tables
```
