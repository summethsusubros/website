const User = require('../models/User');
const Product = require('../models/Product');
const Request = require('../models/Request');
const Platform = require('../models/Platform');
const Release = require('../models/Release');
const History = require('../models/History');
const Present = require('../models/Present'); 
const Data = require('../models/Data'); 
const Display = require('../models/Display'); 

const redis = require('redis-promisify');

const client = redis.createClient(process.env.REDIS_URL);
client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports.index = async (req, res, next) => {
    try {
      const tools = await Release.find({}, 'toolsVersion');
      res.render('va/index', {
        title: 'Platform Tools',
        currentUser: req.user || '',
        tools,
      });
    } catch (error) {
      next(error);
    }
  };


module.exports.index2 = async (req, res, next) => {
    try {
        const tools = req.params.tools.split('-').join(' ').split('+')[0];
        const release = await Release.findOne({ toolsVersion: tools }, 'build');
        const { build } = release;
        res.render('va/index2', {
        title: 'Platform Tools',
        currentUser: req.user || '',
        tools: await Release.find({}, 'toolsVersion'),
        build_list: build,
        filter_tools: tools,
        display: '',
        filter_build: '',
        version_details: {},
        rowId: '',
        platform: '',
        product: '',
        });
    } catch (error) {
        next(error);
    }
};

module.exports.post_index = (req, res) => {
    const tools = req.body.toolsVersion.split(' ').join('-');
    const url = `/index/view/${tools}`;
    res.redirect(url);
};

// Import required modules
const { promisify } = require('util');

// Promisify Redis client methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Define function for getting display data
async function getDisplayData(code) {
  let redis_display_data = await getAsync(`code:${code}`);
  
  if (redis_display_data != null) {
    console.log('display cache hit');
    return JSON.parse(redis_display_data);
  } else {
    console.log('display cache miss');
    let data = await Display.find({ code });
    await setAsync(`code:${code}`, JSON.stringify(data));
    return data;
  }
}

// Define function for getting version details
async function getVersionDetails(product, version) {
  let redis_version_data = await getAsync(`product:${product},version:${version}`);
  
  if (redis_version_data != null) {
    console.log('version cache hit');
    return JSON.parse(redis_version_data);
  } else {
    console.log('version cache miss');
    let product_details = await Product.findOne({ name: product }, 'version');
    let version_details = product_details.version.filter(x => x.name === version)[0];
    await setAsync(`product:${product},version:${version}`, JSON.stringify(version_details));
    return version_details;
  }
}

// Define main function
module.exports.post_index2 = async (req, res) => {
  try {
    let tools = req.params.tools.split('-').join(' ');
    let filter_tools = tools.split('+')[0];
    console.log('body:');
    console.log(req.body);
    console.log('new file');
    let build = req.body.build.split('+').length === 3 ? 'Latest' : req.body.build.split('+')[0];
    let code = parseInt(tools.split('+')[1]) + 0.01 * parseInt(req.body.build.split('+')[1]);
    
    let releases = await Release.find({}, 'toolsVersion');
    let release = await Release.findOne({ toolsVersion: filter_tools }, 'build');
    
    if (req.body.productInput) {
      let display = await getDisplayData(code);
      let version_details = await getVersionDetails(req.body.productInput, req.body.versionInput);
      
      res.render('va/index2', {
        title: 'Platform Tools',
        currentUser: req.user ? req.user : '',
        tools: releases,
        build_list: release.build,
        filter_tools,
        display,
        filter_build: build,
        version_details,
        rowId: req.body.rowId,
        platform: req.body.platformInput,
        product: req.body.productInput
      });
    } else {
      let display = await getDisplayData(code);
      
      res.render('va/index2', {
        title: 'Platform Tools',
        currentUser: req.user ? req.user : '',
        tools: releases,
        build_list: release.build,
        filter_tools,
        display,
        filter_build: build,
        version_details: {},
        rowId: '',
        platform: '',
        product: ''
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal Server Error');
  }
}

  
module.exports.get_index_history = async (req, res, next) => {
    try {
      const filter_product = req.params.product.split('-').join(' ');
      const filter_platform = req.params.platform.split('-').join(' ');
      const history = await History.find({ product: filter_product, platform: filter_platform });
      res.render('va/history', {
        title: 'Configure',
        currentUser: req.user || '',
        history,
        filter_product,
        filter_platform,
      });
    } catch (error) {
      next(error);
    }
};

module.exports.filter = (req, res) => {
    const currentUser = req.user || '';
    res.render('va/filterByProduct', {
      title: 'Filter By Product',
      currentUser,
    });
};
  
module.exports.get_configure = (req, res) => {
    const currentUser = req.user || '';
    res.render('config/configure', {
      title: 'Configure',
      currentUser,
    });
};
  
module.exports.get_ownership = async (req, res, next) => {
    try {
      const loggedInUser = await User.findOne({ email: req.user.email }, 'requested owned message');
      await User.findOneAndUpdate({ email: req.user.email }, {$set: { message: [] }});
      const result = await Product.find({}, 'name version');
      const currentUser = req.user || '';
      console.log('loggedInUser.message', loggedInUser.message);

      res.render('config/ownership', {
        title: 'Configure',
        currentUser,
        product: result,
        requested: loggedInUser.requested,
        owned: loggedInUser.owned,
        messages: loggedInUser.message
      });
    } catch (error) {
      next(error);
    }
};

module.exports.get_product = async (req, res, next) => {
    try {
      const loggedInUser = await User.findOne({ email: req.user.email }, 'owned');
      const currentUser = req.user || '';
      res.render('config/productVersion', {
        title: 'Configure',
        currentUser,
        owned: loggedInUser.owned,
      });
    } catch (error) {
      next(error);
    }
};


module.exports.get_product_details = async (req, res, next) => {
    try {
      const filter_product = req.params.product.split('-').join(' ');
      const loggedInUser = await User.findOne({ email: req.user.email }, 'owned');
      const result = await Product.findOne({ name: filter_product }, 'name version');
      let used = await Data.findOne({}, 'usedArray');
      const currentUser = req.user || '';
      console.log(used);

      res.render('config/addProductVersion', {
        title: 'Configure',
        currentUser,
        owned: loggedInUser.owned,
        name: result.name,
        version: result.version,
        used: used.usedArray
      });
    } catch (error) {
      next(error);
    }
};

module.exports.get_define = async (req, res) => {
  try {
    const loggedInUser = await User.findOne({ email: req.user.email }, 'owned');
    const tools = await Release.find({}, 'toolsVersion');
    res.render('config/defineRelationship', {
      title: 'Configure',
      currentUser: req.user || '',
      owned: loggedInUser.owned,
      tools,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};


module.exports.get_define_details = async (req, res) => {
  try {
    const tools = req.params.tools.split('-').join(' ');
    const toolsReleaseArray = tools.split("+"); 
    const filter_tools = toolsReleaseArray[0];
    const filter_product = req.params.product.split('-').join(' ');
    const currentUser = req.user || '';
    
    const loggedInUser = await User.findOne({ email: req.user.email }, "owned");
    const toolsList = await Release.find({}, "toolsVersion");
    const release = await Release.findOne({ toolsVersion: filter_tools }, "build");
    const platformList = await Platform.find({}, "name");
    const versionList = await Product.findOne({ name: filter_product }, "version");
    const presentList = await Present.find({ product: filter_product });

    res.render('config/addDefineRelationship', {
      title: 'Configure',
      currentUser,
      filter_tools,
      filter_product,
      owned: loggedInUser.owned,
      tools: toolsList,
      platform_list: platformList,
      build_list: release.build,
      version_list: versionList.version,
      present_list: presentList
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports.get_history = async (req, res) => {
    try {
      const filter_product = req.params.product.split('-').join(' ');
      const currentUser = req.user || '';

      const history = await History.find({ product: filter_product });
      res.render('config/productHistory', {
        title: 'Configure',
        currentUser,
        history: history,
        filter_product: filter_product,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
}

module.exports.get_account = async (req, res) => {
    try {
      const loggedInUser = await User.findOne({email: req.user.email}, "owned");
      const owned = loggedInUser.owned;
      const currentUser = req.user || '';
  
      res.render('config/accountSettings', {
        title: 'Configure',
        currentUser,
        owned,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}
  
module.exports.post_ownership = async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.redirect('/configure/ownership');
      }

      console.log(req.user.name);
      const userEmail = req.user.email;
      const userName= req.user.name;

      if (req.body.addprod) {
        const addProdList = typeof(req.body.addprod) === 'object'?req.body.addprod:[req.body.addprod];
  
        for (let i = 0; i < addProdList.length; i++) {
          const requestInstance = new Request({ product: addProdList[i], email: userEmail, name: userName});
          await requestInstance.save();
        }
  
        await User.findOneAndUpdate({ email: userEmail }, { $push: { requested: addProdList } });
        return res.redirect('/configure/ownership');
      }
  
      if (req.body.delprod) {
        const delProdList = typeof(req.body.delprod) === 'object'?req.body.delprod:[req.body.delprod];
  
        for (let i = 0; i < delProdList.length; i++) {
          await Request.deleteOne({ product: delProdList[i], email: userEmail ,name: userName});
        }
  
        await User.findOneAndUpdate({ email: userEmail }, { $pullAll: { requested: delProdList } });
        return res.redirect('/configure/ownership');
      }
  
      res.redirect('/configure/ownership');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  }
  

module.exports.post_add_version = async (req, res) => {
    try {
        const product = req.params.product.split('-').join(' ');
        const versionDetails = {
          name: req.body.version,
          major: req.body.majorVersion,
          startdate: req.body.startDate,
          enddate: req.body.endDate,
          bitness: req.body.bitness,
          downloadLink: req.body.downloadLink,
          discription: req.body.discription,
          location: req.body.location,
          notes: req.body.notes,
        };

        if (!req.body.deleteVersion) {
        // add
        const result = await Product.findOneAndUpdate( { name: product },{ $pull: { version: { name: req.body.version } } });
        const result2 = await Product.findOneAndUpdate( { name: product }, { $push: { version: versionDetails } });

        client.set(`product:${product},version:${req.body.version}`, JSON.stringify(versionDetails));
        res.redirect('/configure/product/' + product);
        } else {
        // delete
        const result = await Product.findOneAndUpdate({ name: product },{ $pull: { version: { name: req.body.deleteVersion } } });
        client.del(`product:${product},version:${req.body.deleteVersion}`);
        res.redirect('/configure/product/' + product);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};
  
module.exports.post_define = async (req, res) => {
    try {
        const toolsReleaseArray = req.body.toolsVersion.split("+"); 
        const toolsRelease = toolsReleaseArray[0];
        const product = req.body.product.split(' ').join('-');
        const toolsReleaseFormatted = toolsRelease.split(' ').join('-');
        res.redirect(`/configure/define/${toolsReleaseFormatted}/${product}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports.post_commit = async (req, res) => {
    try {
      const toolsReleaseArray = req.body.toolsVersion.split("+"); 
      const buildArray = req.body.build.split("+");
      const build = buildArray[0];
      const toolsRelease = toolsReleaseArray[0];
      const code = parseInt(toolsReleaseArray[1]) + 0.01 * parseInt(buildArray[1]);
      const result = await Data.findOne({}, "codeArray");
      const codeArray = result.codeArray;
      codeArray.sort();
      const filteredCodeArray = codeArray.filter(x => x >= code);

  
      for(let i = 0; i < filteredCodeArray.length; i++) {
        await client.del(`code:${filteredCodeArray[i]}`);
        if(req.body.action === "Support") {
          const display_instance = new Display({code: filteredCodeArray[i], product: req.body.product,
            platform: req.body.platform, version: req.body.productVersion});
          await display_instance.save();
        }
        if(req.body.action === "Deprecate") {
          await Display.findOneAndDelete({code: filteredCodeArray[i], product: req.body.product, 
            platform: req.body.platform, version: req.body.productVersion});
        }
      }
  
      const history_instance = new History({code: code, product: req.body.product, toolsRelease: toolsRelease, build: build, 
        platform: req.body.platform, version: req.body.productVersion, action: req.body.action});
      await history_instance.save();
  
      if(req.body.action === "Support") {
        await Data.updateOne({}, { $push: { usedArray: req.body.productVersion } });
        const present_instance = new Present({code: code, product: req.body.product, toolsRelease: toolsRelease, build: build,
          platform: req.body.platform, version: req.body.productVersion});
        await present_instance.save();
      }
  
      if(req.body.action === "Deprecate") {
        await Data.updateOne({}, { $pull: { usedArray: req.body.productVersion } });
        await Present.findOneAndDelete({product: req.body.product, platform: req.body.platform, version: req.body.productVersion});
      }
  
      res.redirect(`/configure/define/${toolsRelease.split(' ').join('-')}/${req.body.product.split(' ').join('-')}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
  };
  

module.exports.post_history = async (req, res) => {
    try {
        await History.deleteOne({_id: req.body.historyId});
        res.redirect(`/configure/history/${req.params.product}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}
  
  
