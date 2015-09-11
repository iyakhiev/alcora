package servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;
import java.sql.*;

/**
 * Created by iyakhiev on 09.09.15.
 */
public class Register extends HttpServlet {
    private DB db;

    public Register() {
        db = new DB();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)  {
        try {
            PrintWriter out = response.getWriter();

            String code = request.getParameter("code"),
                    mail = request.getParameter("mail");
            out.println("Your mail = " + mail);
            out.println("Your code = " + code);

            Statement stmt = db.connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM alcora.users WHERE email = '" + mail + "';");
            int ans = 0, n = 0;
            while(rs.next()) {
                n++;
                if(rs.getString("active").equals(code)) {
                    String query = "UPDATE alcora.users SET active='true' WHERE id='" + Integer.parseInt(rs.getString("id")) + "'";

                    PreparedStatement preparedStmt = db.connection.prepareStatement(query);
                    preparedStmt.execute();
                    ans = 1;
                } else {
                    if(rs.getString("active").equals("true")) {
                        ans = 2;
                    } else {
                        ans = -1;
                    }
                }
            }
            if(n == 0) {
                ans = 0;
            }
            out.println("{ \"status\": \"" + ans + "\" }");
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) {
        try {
            res.setContentType("application/json");
            req.setCharacterEncoding("utf-8");
            PrintWriter out = res.getWriter();
            String action = req.getParameter("action");
            System.out.println("action: " + action);

            Statement stmt = db.connection.createStatement();
            if(action.equals("check")) {
                String mail = req.getParameter("mail");
                System.out.print("mail:" + mail);
                ResultSet rs = stmt.executeQuery("SELECT * FROM alcora.users WHERE email = '" + mail + "';");
                int n = 0;
                while(rs.next()) {
                    n++;
                }
                out.println("{ \"check\": \"" + n + "\" }");
                out.close();
            }
            if(action.equals("adduser")) {
                String status = "KO!";
                String mail = req.getParameter("mail"),
                        password = req.getParameter("password"),
                        userName = req.getParameter("userName"),
                        code = UUID.randomUUID().toString(),
                        link = "http://localhost:8080/web_war_exploded/register?mail=" + mail + "&code=" + code;

                try{
                    String query = "INSERT INTO alcora.users (name, email, password, active) VALUES (?, ?, ?, ?);";

                    PreparedStatement preparedStmt = db.connection.prepareStatement(query);
                    preparedStmt.setString(1, userName);
                    preparedStmt.setString(2, mail);
                    preparedStmt.setString(3, password);
                    preparedStmt.setString(4, code);
                    preparedStmt.execute();

                    Emailer.send(mail, "Для активации аккаунта перейдите по ссылке: \n " +
                            "<a href='" + link + "' >" + link + "</a>",
                            "text/html; charset=utf-8",
                            "Активация аккаунта на Alcora");
                    status = "OK!";
                } catch(SQLException e){
                    if(e.getErrorCode() == 1062 ){
                        System.out.println("dp");
                    }
                }
                System.out.println("End");


                out.println("{ \"status\": \"" + status + "\" }");
                out.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
