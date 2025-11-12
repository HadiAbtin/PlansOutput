// ============================================
// کد آماده برای کپی در n8n Code Node
// Language: JavaScript
// ============================================

/**
 * تابع برای تبدیل \n literal به خطوط جدید واقعی
 * این مشکل زمانی پیش می‌آید که داده از JSON string literal کپی می‌شود
 */
function fixNewlines(markdown) {
  // اگر \n literal وجود دارد (نه خطوط جدید واقعی)
  if (markdown.includes('\\n')) {
    // تبدیل \n literal به خطوط جدید واقعی
    // ابتدا \\n را به \n تبدیل می‌کنیم (unescape)
    let fixed = markdown.replace(/\\n/g, '\n');
    
    // اگر هنوز \\\\n وجود دارد (double escaped)
    fixed = fixed.replace(/\\\\n/g, '\n');
    
    return fixed;
  }
  return markdown;
}

function convertJsonToMarkdown(jsonData, planNumber = null, planType = null) {
  let markdown = '';
  const nutritionPlan = jsonData[0]?.nutritionPlan;
  
  // Handle workoutPlan - it can be in jsonData[1] or jsonData[0]
  let workoutPlan = null;
  
  console.log('=== Inside convertJsonToMarkdown ===');
  console.log('jsonData length:', jsonData.length);
  console.log('jsonData[1] exists:', !!jsonData[1]);
  console.log('jsonData[1]?.workoutPlan exists:', !!jsonData[1]?.workoutPlan);
  
  // First try jsonData[1]
  if (jsonData[1]?.workoutPlan) {
    console.log('Found workoutPlan in jsonData[1]');
    if (Array.isArray(jsonData[1].workoutPlan)) {
      console.log('workoutPlan is array, length:', jsonData[1].workoutPlan.length);
      const firstItem = jsonData[1].workoutPlan[0];
      workoutPlan = firstItem?.workoutPlan || firstItem;
      console.log('Extracted workoutPlan from array, has microcycles:', !!workoutPlan?.microcycles);
    } else {
      workoutPlan = jsonData[1].workoutPlan.workoutPlan || jsonData[1].workoutPlan;
      console.log('Extracted workoutPlan from object, has microcycles:', !!workoutPlan?.microcycles);
    }
  }
  // If not found, try jsonData[0]
  else if (jsonData[0]?.workoutPlan) {
    console.log('Found workoutPlan in jsonData[0]');
    if (Array.isArray(jsonData[0].workoutPlan)) {
      const firstItem = jsonData[0].workoutPlan[0];
      workoutPlan = firstItem?.workoutPlan || firstItem;
    } else {
      workoutPlan = jsonData[0].workoutPlan.workoutPlan || jsonData[0].workoutPlan;
    }
  } else {
    console.log('workoutPlan NOT FOUND!');
  }
  
  console.log('Final workoutPlan:', workoutPlan ? 'EXISTS' : 'NULL');
  console.log('workoutPlan has microcycles:', !!workoutPlan?.microcycles);
  
  const planTitle = planNumber ? `Plan ${planNumber}` : 'Plan';
  const planTypeText = planType ? ` (${planType})` : '';
  markdown += `# ${planTitle} - Nutrition & Workout Plan${planTypeText}\n\n`;
  
  if (nutritionPlan && nutritionPlan.weeks) {
    markdown += `## 🥗 Nutrition Plan\n\n`;
    nutritionPlan.weeks.forEach((week) => {
      markdown += `### Week ${week.week}\n\n`;
      if (week.weekly_targets) {
        markdown += `**Weekly Targets:**\n`;
        markdown += `- Daily calories: ${week.weekly_targets.daily_calories_kcal} kcal\n`;
        markdown += `- Protein: ${week.weekly_targets.protein_g} g\n`;
        markdown += `- Fiber: ${week.weekly_targets.fiber_g} g\n`;
        markdown += `- Sugar: ${week.weekly_targets.sugar_g} g\n`;
        markdown += `- Water: ${week.weekly_targets.water_l} L\n\n`;
      }
      if (week.training_summary) {
        markdown += `**Training Summary:**\n`;
        markdown += `- Total minutes: ${week.training_summary.total_minutes}\n`;
        markdown += `- Quality minutes: ${week.training_summary.quality_minutes}\n`;
        markdown += `- Intensity level: ${week.training_summary.intensity_level}\n`;
        if (week.training_summary.narrative) {
          markdown += `- Narrative: ${week.training_summary.narrative}\n`;
        }
        markdown += `\n`;
      }
      if (week.menu && Array.isArray(week.menu)) {
        week.menu.forEach((dayMenu) => {
          markdown += `#### ${dayMenu.day}\n\n`;
          if (dayMenu.breakfast && dayMenu.breakfast.length > 0) {
            markdown += `**Breakfast:**\n| Food | Amount (g) | kcal |\n|------|-----------|------|\n`;
            dayMenu.breakfast.forEach(food => {
              markdown += `| ${food.name} | ${food.grams_g} | ${food.kcal_total} |\n`;
            });
            markdown += `\n`;
          }
          if (dayMenu.lunch && dayMenu.lunch.length > 0) {
            markdown += `**Lunch:**\n| Food | Amount (g) | kcal |\n|------|-----------|------|\n`;
            dayMenu.lunch.forEach(food => {
              markdown += `| ${food.name} | ${food.grams_g} | ${food.kcal_total} |\n`;
            });
            markdown += `\n`;
          }
          if (dayMenu.dinner && dayMenu.dinner.length > 0) {
            markdown += `**Dinner:**\n| Food | Amount (g) | kcal |\n|------|-----------|------|\n`;
            dayMenu.dinner.forEach(food => {
              markdown += `| ${food.name} | ${food.grams_g} | ${food.kcal_total} |\n`;
            });
            markdown += `\n`;
          }
          if (dayMenu.snack && dayMenu.snack.length > 0) {
            markdown += `**Snack:**\n| Food | Amount (g) | kcal |\n|------|-----------|------|\n`;
            dayMenu.snack.forEach(food => {
              markdown += `| ${food.name} | ${food.grams_g} | ${food.kcal_total} |\n`;
            });
            markdown += `\n`;
          }
        });
      }
      if (week.hydration) {
        markdown += `**Hydration:** ${week.hydration}\n\n`;
      }
      if (week.fueling_guidance && Array.isArray(week.fueling_guidance)) {
        markdown += `**Fueling Guidance:**\n`;
        week.fueling_guidance.forEach(guidance => {
          markdown += `- **${guidance.context}:** ${guidance.advice}\n`;
        });
        markdown += `\n`;
      }
    });
  }
  
  if (workoutPlan && workoutPlan.microcycles) {
    markdown += `## 🏃 Workout Plan\n\n`;
    if (workoutPlan.goal) {
      markdown += `| Field | Value |\n|-------|-------|\n`;
      markdown += `| goal | ${workoutPlan.goal} |\n`;
      if (workoutPlan.locale) markdown += `| locale | ${workoutPlan.locale} |\n`;
      if (workoutPlan.horizonDays) markdown += `| horizonDays | ${workoutPlan.horizonDays} |\n`;
      if (workoutPlan.weekly_split) markdown += `| weekly_split | ${workoutPlan.weekly_split} |\n`;
      markdown += `\n`;
    }
    workoutPlan.microcycles.forEach((microcycle) => {
      markdown += `### Week ${microcycle.week}\n\n`;
      if (microcycle.sessions && Array.isArray(microcycle.sessions)) {
        microcycle.sessions.forEach((session) => {
          markdown += `#### ${session.day}\n`;
          if (session.blocks && Array.isArray(session.blocks) && session.blocks.length > 0) {
            session.blocks.forEach((block) => {
              if (block.type) {
                markdown += `**Type:** ${block.type}`;
                if (block.duration_min) markdown += ` (${block.duration_min} min)`;
                markdown += `\n`;
              }
              if (block.intensity) {
                markdown += `**Intensity:** ${block.intensity}\n`;
              }
              if (block.details) {
                markdown += `\n**STEPS:**\n`;
                // اگر details شامل \n literal است، آن را تبدیل می‌کنیم
                const detailsFixed = fixNewlines(block.details);
                detailsFixed.split('\n').filter(line => line.trim()).forEach(step => {
                  markdown += `${step}\n`;
                });
                markdown += `\n`;
              }
              if (block.exercises && Array.isArray(block.exercises) && block.exercises.length > 0) {
                markdown += `**Exercises:**\n| Exercise | Sets | Reps | RIR | Rest (sec) | Notes |\n|----------|------|------|-----|------------|-------|\n`;
                block.exercises.forEach(exercise => {
                  const notes = exercise.notes ? fixNewlines(exercise.notes) : '';
                  markdown += `| ${exercise.name} | ${exercise.sets} | ${exercise.reps} | ${exercise.RIR} | ${exercise.rest_sec} | ${notes} |\n`;
                });
                markdown += `\n`;
              }
            });
          } else {
            if (session.intensity === 'N/A' || session.day.includes('Rest')) {
              markdown += `> Rest day\n\n`;
            }
          }
        });
      }
    });
    if (workoutPlan.progression) {
      markdown += `**Progression:**\n- **Method:** ${workoutPlan.progression.method}\n`;
      if (workoutPlan.progression.rules && Array.isArray(workoutPlan.progression.rules)) {
        markdown += `- **Rules:**\n`;
        workoutPlan.progression.rules.forEach(rule => {
          markdown += `  - ${fixNewlines(rule)}\n`;
        });
      }
      markdown += `\n`;
    }
    if (workoutPlan.deload) {
      markdown += `**Deload:**\n`;
      if (workoutPlan.deload.weeks && Array.isArray(workoutPlan.deload.weeks)) {
        markdown += `- **Weeks:** [${workoutPlan.deload.weeks.join(', ')}]\n`;
      }
      if (workoutPlan.deload.strategy) {
        markdown += `- **Strategy:** ${fixNewlines(workoutPlan.deload.strategy)}\n`;
      }
      markdown += `\n`;
    }
    if (workoutPlan.safety && Array.isArray(workoutPlan.safety)) {
      markdown += `**Safety:**\n`;
      workoutPlan.safety.forEach(item => {
        markdown += `- ${fixNewlines(item)}\n`;
      });
      markdown += `\n`;
    }
    if (workoutPlan.notes) {
      markdown += `**Notes:**\n${fixNewlines(workoutPlan.notes)}\n\n`;
    }
    if (workoutPlan.fueling_guidance && Array.isArray(workoutPlan.fueling_guidance)) {
      markdown += `**Fueling Guidance:**\n| Day | Suggestion |\n|-----|------------|\n`;
      workoutPlan.fueling_guidance.forEach(item => {
        markdown += `| ${item.day} | ${fixNewlines(item.suggestion)} |\n`;
      });
      markdown += `\n`;
    }
  }
  
  // در انتها، کل markdown را fix می‌کنیم تا مطمئن شویم هیچ \n literal باقی نمانده
  markdown = fixNewlines(markdown);
  
  return markdown;
}

// دریافت JSON از node قبلی
// در n8n، ممکن است ورودی به صورت چند item باشد یا یک آرایه
const allInputs = $input.all();
console.log('Total input items:', allInputs.length);

// اگر فقط یک item داریم و json آن یک آرایه است، از آن استفاده می‌کنیم
// در غیر این صورت، همه items را جمع می‌کنیم
let inputData;
if (allInputs.length === 1) {
  inputData = allInputs[0].json;
} else {
  // اگر چند item داریم، همه را جمع می‌کنیم
  inputData = allInputs.map(item => item.json);
}

// Debug: بررسی ساختار JSON
console.log('Input data type:', typeof inputData);
console.log('Is array:', Array.isArray(inputData));
if (Array.isArray(inputData)) {
  console.log('Array length:', inputData.length);
  if (inputData.length > 0) {
    console.log('First element keys:', Object.keys(inputData[0] || {}));
    if (inputData.length > 1) {
      console.log('Second element keys:', Object.keys(inputData[1] || {}));
    }
  }
} else {
  console.log('Keys:', Object.keys(inputData || {}));
  if (inputData && typeof inputData === 'object' && !Array.isArray(inputData)) {
    console.log('Has data field:', !!inputData.data, 'isArray:', Array.isArray(inputData.data));
    console.log('Has body field:', !!inputData.body, 'isArray:', Array.isArray(inputData.body));
    console.log('Has json field:', !!inputData.json, 'isArray:', Array.isArray(inputData.json));
    console.log('Has nutritionPlan:', !!inputData.nutritionPlan);
    console.log('Has workoutPlan:', !!inputData.workoutPlan);
  }
}

// تبدیل به آرایه اگر نیست
let jsonData;
if (Array.isArray(inputData)) {
  jsonData = inputData;
} else if (inputData && typeof inputData === 'object') {
  // اول بررسی می‌کنیم که آیا در فیلدهای data، body یا json آرایه وجود دارد
  if (inputData.data && Array.isArray(inputData.data)) {
    // اگر در فیلد data است
    jsonData = inputData.data;
  } else if (inputData.body && Array.isArray(inputData.body)) {
    // اگر در فیلد body است
    jsonData = inputData.body;
  } else if (inputData.json && Array.isArray(inputData.json)) {
    // اگر در فیلد json است
    jsonData = inputData.json;
  } else if (inputData.nutritionPlan || inputData.workoutPlan) {
    // اگر مستقیماً nutritionPlan و workoutPlan دارد
    jsonData = [inputData];
  } else {
    // اگر هیچکدام نیست، سعی می‌کنیم آن را به آرایه تبدیل کنیم
    jsonData = [inputData];
  }
} else if (typeof inputData === 'string') {
  // اگر string است، parse می‌کنیم
  try {
    const parsed = JSON.parse(inputData);
    if (Array.isArray(parsed)) {
      jsonData = parsed;
    } else {
      jsonData = [parsed];
    }
  } catch (e) {
    return {
      json: {
        error: 'Invalid JSON format',
        errorMessage: e.message,
        inputData: inputData,
        markdown: '# Error\n\nCould not parse JSON data.'
      }
    };
  }
} else {
  jsonData = [inputData];
}

// Debug: بررسی ساختار نهایی
console.log('Final jsonData type:', typeof jsonData);
console.log('Final jsonData is array:', Array.isArray(jsonData));
if (Array.isArray(jsonData) && jsonData.length > 0) {
  console.log('Array length:', jsonData.length);
  console.log('First element keys:', Object.keys(jsonData[0] || {}));
  console.log('Has nutritionPlan:', !!jsonData[0]?.nutritionPlan);
  if (jsonData.length > 1) {
    console.log('Second element keys:', Object.keys(jsonData[1] || {}));
    console.log('Second element has workoutPlan:', !!jsonData[1]?.workoutPlan);
    if (jsonData[1]?.workoutPlan) {
      console.log('workoutPlan type:', typeof jsonData[1].workoutPlan);
      console.log('workoutPlan is array:', Array.isArray(jsonData[1].workoutPlan));
      if (Array.isArray(jsonData[1].workoutPlan) && jsonData[1].workoutPlan.length > 0) {
        console.log('workoutPlan[0] keys:', Object.keys(jsonData[1].workoutPlan[0] || {}));
        console.log('workoutPlan[0] has workoutPlan:', !!jsonData[1].workoutPlan[0]?.workoutPlan);
      }
    }
  }
  
  // Check workoutPlan structure - try both jsonData[1] and jsonData[0]
  let hasWorkoutPlan = false;
  if (jsonData[1]?.workoutPlan) {
    if (Array.isArray(jsonData[1].workoutPlan)) {
      hasWorkoutPlan = !!jsonData[1].workoutPlan[0]?.workoutPlan || !!jsonData[1].workoutPlan[0];
    } else {
      hasWorkoutPlan = !!jsonData[1].workoutPlan.workoutPlan || !!jsonData[1].workoutPlan;
    }
  } else if (jsonData[0]?.workoutPlan) {
    if (Array.isArray(jsonData[0].workoutPlan)) {
      hasWorkoutPlan = !!jsonData[0].workoutPlan[0]?.workoutPlan || !!jsonData[0].workoutPlan[0];
    } else {
      hasWorkoutPlan = !!jsonData[0].workoutPlan.workoutPlan || !!jsonData[0].workoutPlan;
    }
  }
  console.log('Has workoutPlan:', hasWorkoutPlan);
}

// تبدیل به Markdown
const markdown = convertJsonToMarkdown(jsonData);

// خروجی - محاسبه hasWorkoutPlan برای debug (check both jsonData[1] and jsonData[0])
let hasWorkoutPlanDebug = false;
if (jsonData[1]?.workoutPlan) {
  if (Array.isArray(jsonData[1].workoutPlan)) {
    hasWorkoutPlanDebug = !!jsonData[1].workoutPlan[0]?.workoutPlan || !!jsonData[1].workoutPlan[0];
  } else {
    hasWorkoutPlanDebug = !!jsonData[1].workoutPlan.workoutPlan || !!jsonData[1].workoutPlan;
  }
} else if (jsonData[0]?.workoutPlan) {
  if (Array.isArray(jsonData[0].workoutPlan)) {
    hasWorkoutPlanDebug = !!jsonData[0].workoutPlan[0]?.workoutPlan || !!jsonData[0].workoutPlan[0];
  } else {
    hasWorkoutPlanDebug = !!jsonData[0].workoutPlan.workoutPlan || !!jsonData[0].workoutPlan;
  }
}

// بررسی نهایی: اگر markdown هنوز \n literal دارد، دوباره fix می‌کنیم
const finalMarkdown = fixNewlines(markdown);

return {
  json: {
    markdown: finalMarkdown,
    debug: {
      inputType: typeof inputData,
      isArray: Array.isArray(inputData),
      finalArrayLength: Array.isArray(jsonData) ? jsonData.length : 0,
      hasNutritionPlan: !!jsonData[0]?.nutritionPlan,
      hasWorkoutPlan: hasWorkoutPlanDebug,
      hadNewlineIssues: markdown !== finalMarkdown
    }
  }
};

