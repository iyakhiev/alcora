package servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Created by Asus on 11.09.2015.
 */
public class Questionary extends HttpServlet {
    private DB db;

    public Questionary() {
        db = new DB();
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) {
        try {
            res.setContentType("text/html; charset=UTF-8");
            res.setCharacterEncoding("UTF-8");
            PrintWriter out = res.getWriter();
            int id_parent = Integer.parseInt(req.getParameter("id_parent"));

            Statement stmt = db.connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, description, nodes, select_type, type_description FROM\n" +
                    "\t(SELECT * FROM\n" +
                    "\t\t(SELECT * FROM\n" +
                    "\t\t\t(SELECT id_child FROM alcora.categories_connections WHERE id_parent = " + id_parent + ") as t1\n" +
                    "\t\tLEFT JOIN\n" +
                    "\t\t\t(SELECT * FROM alcora.categories) as t2\n" +
                    "\t\tON t1.id_child = t2.id) as t3\n" +
                    "\tLEFT JOIN\n" +
                    "\t\t(SELECT id_parent as nodes FROM alcora.categories_connections group by id_parent) as t4\n" +
                    "\tON t3.id = t4.nodes) as t5\n" +
                    "LEFT JOIN\n" +
                    "\t(SELECT id as type_id, description as type_description FROM alcora.categories_types) as t6\n" +
                    "ON t5.type_id = t6.type_id;");
            String answer = "{ \"list\": [";
            int n = 0;
            while (rs.next()) {
                n++;
                String id = rs.getString("id"),
                        description = rs.getString("description"),
                        nodes = rs.getString("nodes"),
                        select_type = rs.getString("select_type"),
                        type_description = rs.getString("type_description");
                answer += "{ " +
                        "\"id\": \"" + id + "\", " +
                        "\"title\": \"" + description + "\", " +
                        "\"nodes\": \"" + nodes + "\", " +
                        "\"select_type\": \"" + select_type + "\"," +
                        "\"type_description\": \"" + type_description + "\"" +
                        " },";
            }
            answer = answer.substring(0, answer.length() - 1);
            answer += "]}";
            out.println(n > 0 ? answer : "{ \"list\": \"empty\" }");
            out.close();

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}