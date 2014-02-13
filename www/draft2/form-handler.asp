<%
response_str = "{"
response_str = response_str + """payee"": """ & request("payee") & """, "
response_str = response_str + """from_account"": """ & request("from_account") & """, "
response_str = response_str + """payment_date"": """ & request.form("payment_date") & """, "
response_str = response_str + """payment_amount"": """ & request.form("payment_amount") & """, "
response_str = response_str + """comment"": """ & request.form("comment") & """, "
response_str = response_str + """confirmation_id"": ""1234567890"""
response_str = response_str + "}"
response.write(response_str)
%>