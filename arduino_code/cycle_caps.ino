const int trigger_pin = 7;
const int cap_pin = A0;
void setup()
{
  pinMode(trigger_pin, OUTPUT);
  Serial.begin(9600);
  
}

void loop() {
  /*digitalWrite(trigger_pin, HIGH);
  delay(1000);
  digitalWrite(trigger_pin, LOW);
  delay(1000); */
  
  int adc = analogRead(cap_pin);
  float voltage = adc/1024.0 * 5.0;
  Serial.println("Chargin");
  Serial.println(voltage);
  if (voltage > 2.5) {//2.63) {
    digitalWrite(trigger_pin, HIGH);   
    int new_voltage_adc = 1024;
    while (new_voltage_adc/1024.0*5.0 > .2) {
      Serial.println("Dischargin");
      Serial.println(new_voltage_adc/1024.0*5.0);
      new_voltage_adc = analogRead(cap_pin); 
    }
    digitalWrite(trigger_pin, LOW);
  }
  

}
