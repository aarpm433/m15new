package rocket.com;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;


import static org.junit.jupiter.api.Assertions.*;

public class FormValidationTests {

    private WebDriver driver;

    @BeforeEach
    void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
    }

    @AfterEach
    void tearDown() {
        driver.quit();
    }

    // --- M3 Contact Form Test ---
    @Test
    void testContactForm_Filling() {
        driver.get("http://localhost:5500/M3/index.html"); // or contact page

        driver.findElement(By.id("fullname")).sendKeys("Aaron Calkins");
        driver.findElement(By.id("email")).sendKeys("aaron@test.com");
        driver.findElement(By.id("phone")).sendKeys("5551234567");
        driver.findElement(By.id("company_name")).sendKeys("Codeboxx");
        driver.findElement(By.id("project_name")).sendKeys("Elevator Project");
        driver.findElement(By.id("project_desc")).sendKeys("Install new residential elevators");

        Select department = new Select(driver.findElement(By.id("department")));
        department.selectByVisibleText("Residential");

        driver.findElement(By.id("message")).sendKeys("Please contact me for details.");

        driver.findElement(By.cssSelector("#contact-form button[type='submit']")).click();
        // You could add assertions to check the success modal here
    }

    // --- Responsiveness Test for M9 Home Page ---
    @Test
    void testHomePage_Responsiveness() {
        driver.get("http://127.0.0.1:5173/login");

        // Fill login form
        driver.findElement(By.id("email")).sendKeys("aaron.calkins123@gmail.com");
        driver.findElement(By.id("password")).sendKeys("1234");
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // Wait until home page loads and navbar is visible
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement navbar = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".navbar")));

        // Test responsiveness
        driver.manage().window().setSize(new Dimension(1920, 1080));
        assertTrue(navbar.isDisplayed());

        driver.manage().window().setSize(new Dimension(768, 1024));
        assertTrue(navbar.isDisplayed());

        driver.manage().window().setSize(new Dimension(375, 667));
        assertTrue(navbar.isDisplayed());


    }

    // --- M3 Quote Form Test ---
    @Test
        void testQuoteForm_FillOut() {
            driver.get("http://localhost:5500/M3/quote.html");

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            JavascriptExecutor js = (JavascriptExecutor) driver;

            // ---------- STEP 1: Select Building Type ----------
            WebElement buildingType = wait.until(
                ExpectedConditions.elementToBeClickable(By.id("building-type"))
            );
            buildingType.sendKeys("Residential");

            // ---------- STEP 2: Wait for Step 2 ----------
            WebElement step2 = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("step2"))
            );
            assertTrue(step2.isDisplayed());

            // ---------- STEP 3: Fill Required Fields ----------
            WebElement floors = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                    By.cssSelector("#number-of-floors input")
                )
            );
            js.executeScript("arguments[0].scrollIntoView(true);", floors);
            floors.sendKeys("10");

            WebElement apartments = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                    By.cssSelector("#number-of-apartments input")
                )
            );
            js.executeScript("arguments[0].scrollIntoView(true);", apartments);
            apartments.sendKeys("20");

            // ---------- STEP 4: Select Product Line (JS click) ----------
            WebElement standardRadio = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.id("standard"))
            );
            js.executeScript("arguments[0].scrollIntoView(true);", standardRadio);
            js.executeScript("arguments[0].click();", standardRadio);

            // ---------- STEP 5: Validate Pricing Outputs ----------
            WebElement unitPrice = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                    By.cssSelector("#elevator-unit-price input")
                )
            );

            WebElement totalPrice = driver.findElement(
                By.cssSelector("#elevator-total-price input")
            );
            WebElement installationFee = driver.findElement(
                By.cssSelector("#installation-fees input")
            );
            WebElement finalPrice = driver.findElement(
                By.cssSelector("#final-price input")
            );

            assertTrue(unitPrice.isDisplayed());
            assertTrue(totalPrice.isDisplayed());
            assertTrue(installationFee.isDisplayed());
            assertTrue(finalPrice.isDisplayed());
        }
// --- M3 Navigation Test ---
    @Test
        void testNavigation_M3_Pages() {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // ---------- HOME ----------
            driver.get("http://localhost:5500/M3/index.html");
            wait.until(ExpectedConditions.titleContains("Rocket Elevators")); // adjust title if needed
            assertTrue(driver.getTitle().contains("Rocket Elevators"));

            // ---------- QUOTE ----------
            driver.get("http://localhost:5500/M3/quote.html");
            wait.until(ExpectedConditions.titleContains("Rocket Elevators")); // adjust title if needed
            assertTrue(driver.getTitle().contains("Rocket Elevators"));

            // ---------- CONTACT ----------
            driver.get("http://localhost:5500/M3/residential.html");
            wait.until(ExpectedConditions.titleContains("Rocket Elevators")); // adjust title if needed
            assertTrue(driver.getTitle().contains("Rocket Elevators"));
        }
        // --- M9 Login Test ---
    @Test
        void testM9_LoginOnly() {
            driver.get("http://127.0.0.1:5173/login");

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // ---------- FILL LOGIN FORM ----------
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")))
                .sendKeys("aaron.calkins123@gmail.com");

            driver.findElement(By.id("password")).sendKeys("1234");
            driver.findElement(By.cssSelector("button[type='submit']")).click();

            // ---------- VERIFY LOGIN SUCCESS ----------
            wait.until(ExpectedConditions.not(
                ExpectedConditions.urlContains("/login")
            ));

            assertFalse(driver.getCurrentUrl().contains("/login"), "Should be redirected after login");
    }
// --- M9 Create New Post Test ---
    @Test
        void testM9_RegisterNewUser() {
            driver.get("http://127.0.0.1:5173/register");
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // ---------- FILL FORM ----------
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("first_name")))
                    .sendKeys("Aaron");
            driver.findElement(By.id("last_name")).sendKeys("Calkins");
            driver.findElement(By.id("email")).sendKeys("aaron.selenium@test.com");
            driver.findElement(By.id("password")).sendKeys("1234");
            driver.findElement(By.id("birthday")).sendKeys("1111111111");
            driver.findElement(By.id("occupation")).sendKeys("1234");
            driver.findElement(By.id("location")).sendKeys("1234");
        ;

            // ---------- SUBMIT FORM ----------
            WebElement submitBtn = driver.findElement(By.cssSelector("button[type='submit']"));

            // Scroll into view (ensures no sticky header blocks it)
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitBtn);

            // Optional: wait until clickable
            wait.until(ExpectedConditions.elementToBeClickable(submitBtn));

            // Click via JavaScript (bypasses overlays)
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitBtn);
        }
}

