import sql from "mssql";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    return res.json("Hi gamers")
});

const config = 
{
    user: "users",
    password: "1234",
    server: "WADI-UR-REHMAN",
    database: "project",
    options:
    {
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: "SQLEXPRESS",
    },
    port: 1433,
};

app.get('/card', async (req, res) => {
  try {
    const { q } = req.query; // Capture the query from the URL (if any)
    const pool = await sql.connect(config);

    let query;
    if (q) {
      // If a query parameter exists, filter the results
      query = `SELECT * FROM [vw_games] WHERE name LIKE '%${q}%'`;
    } else {
      // Otherwise, fetch all games
      query = 'SELECT * FROM [vw_games]';
    }
    // Query the database
    const run = await pool.request().query('use project');
    const result = await pool.request().query(query);

    // Send the result to the client
    return res.json(result.recordset);
  } catch (err) {
      console.error('Error querying the database:', err);
  
      // Send a 500 error response
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/comp', async (req, res) => {
    try {
      const comp = await sql.connect(config);
      const run = await comp.request().query('use project');
  
      const result = await comp.request().query('SELECT * FROM [vw-competition];');
      return res.json(result.recordset); // Use result instead of res here
    } catch (err) {
      console.error('Error fetching data', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    const dynamicConfig = {
      user: username,
      password: password,
      server: "WADI-UR-REHMAN",
      database: "project",
      options: {
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: "SQLEXPRESS",
      },
      port: 1433,
    };
  
    try {
      // Test SQL Server connection with provided credentials
      const pool = await sql.connect(dynamicConfig);
      const run = await pool.request().query('use project');

  
      return res.json({ success: true, message: 'Login successful' });
    } catch (error) {
      console.error('Login failed:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
  
  app.post('/handle_game', async (req, res) => {
    const {
      username,
      password,
      operation,
      name,
      type_id,
      genre_id,
      price,
      D_id,
      url,
      release_year,
      plat_id,
    } = req.body;
  
    const dynamicConfig = {
      user: username,
      password: password,
      server: "WADI-UR-REHMAN",
      database: "project",
      options: {
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: "SQLEXPRESS",
      },
      port: 1433,
    };
  
    try {
      const pool = await sql.connect(dynamicConfig);
      const run = await pool.request().query('use project');
  
      // Handle the requested operation
      if (operation) {
        await pool
          .request()
          .input("operation", sql.VarChar(50), operation)
          .input("name", sql.VarChar(100), name || null)
          .input("type_id", sql.Int, type_id || null)
          .input("genre_id", sql.Int, genre_id || null)
          .input("price", sql.Decimal(8, 2), price || null)
          .input("D_id", sql.Int, D_id || null)
          .input("url", sql.VarChar(200), url || null)
          .input("release_year", sql.Int, release_year || null)
          .input("plat_id", sql.Int, plat_id || null)
          .execute("handle_games");
      }
  
      // Fetch all games (regardless of whether an operation was performed or not)
      const games = await pool.request().query("SELECT * FROM vw_games");
      const genre = await pool.request().query('SELECT * FROM Genre');
      const type = await pool.request().query('SELECT * FROM Type');
      const platform = await pool.request().query('SELECT * FROM Platform');
  
      return res.json({
        success: true,
        message: operation
          ? `Operation ${operation} executed successfully`
          : "Fetched games successfully",
        games: games.recordset,
        genre:genre.recordset,
        type:type.recordset,
        platform:platform.recordset,
      });
    } catch (error) {
      console.error("Error executing handle_games:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  
  app.post('/update', async (req, res) => {
    const { name, url, price } = req.body;
  
    const dynamicConfig = {
      user: "sr manager", // Use fixed credentials for now
      password: "1234",
      server: "WADI-UR-REHMAN",
      database: "project",
      options: {
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: "SQLEXPRESS",
      },
      port: 1433,
    };
  
    try {
      const pool = await sql.connect(dynamicConfig);
  
      // Fetch all games
      const games = await pool.request().query('SELECT * FROM vw_games');
  
      let operationMessage = "Data fetched successfully";
  
      // Update game details if name, URL, or price is provided
      if (name && (url || price)) {
        await pool.request()
          .input('name', sql.VarChar(50), name)
          .input('url', sql.VarChar(200), url || null)
          .input('price', sql.Int, price || null)
          .execute('update_game_details');
        operationMessage = `Game "${name}" updated successfully`;
      }
  
      return res.json({
        success: true,
        message: operationMessage,
        games: games.recordset, // Always include the updated game list
      });
    } catch (error) {
      console.error('Error executing handle_games:', error.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  app.post('/log', async (req, res) => {
    
    const dynamicConfig = {
      user: "sr manager", // Use fixed credentials for now
      password: "1234",
      server: "WADI-UR-REHMAN",
      database: "project",
      options: {
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: "SQLEXPRESS",
      },
      port: 1433,
    };
  
    try {
      // Connect to the database
      const pool = await sql.connect(dynamicConfig);
  
      // Execute the query to fetch logs
      const result = await pool.request().query('SELECT * FROM change_log;');
  
      // Return the logs as JSON response
      return res.json({ success: true, logs: result.recordset });
    } catch (err) {
      console.error('Error fetching log book:', err);
  
      // Return an error response
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  });
  
app.listen(3000, () => {
    console.log("The server has started on port 3000");
})